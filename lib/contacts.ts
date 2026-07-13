import 'server-only';
import { db } from './db';
import { contacts } from './db/schema';
import { eq, desc } from 'drizzle-orm';

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  phone: string | null;
  company: string | null;
  createdAt: Date;
  read: boolean;
}

/**
 * Create a new contact submission
 */
export async function createContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  company?: string;
}): Promise<Contact> {
  const [result] = await db
    .insert(contacts)
    .values({
      ...data,
      createdAt: new Date(),
      read: false,
    })
    .returning();

  return result as Contact;
}

/**
 * Get all contact submissions (admin only)
 */
export async function getAllContacts(): Promise<Contact[]> {
  const result = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt));

  return result as Contact[];
}

/**
 * Get unread contacts (admin only)
 */
export async function getUnreadContacts(): Promise<Contact[]> {
  const result = await db
    .select()
    .from(contacts)
    .where(eq(contacts.read, false))
    .orderBy(desc(contacts.createdAt));

  return result as Contact[];
}

/**
 * Get a single contact by ID
 */
export async function getContactById(id: number): Promise<Contact | null> {
  const [result] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id));

  return result || null;
}

/**
 * Mark a contact as read
 */
export async function markContactAsRead(id: number): Promise<Contact | null> {
  const [result] = await db
    .update(contacts)
    .set({ read: true })
    .where(eq(contacts.id, id))
    .returning();

  return result || null;
}

/**
 * Delete a contact
 */
export async function deleteContact(id: number): Promise<boolean> {
  const result = await db
    .delete(contacts)
    .where(eq(contacts.id, id))

  return (result.rowCount ?? 0) > 0
}

/**
 * Get contact count by read status
 */
export async function getContactStats(): Promise<{ total: number; unread: number }> {
  const allResult = await db.select().from(contacts);
  const unreadResult = await db
    .select()
    .from(contacts)
    .where(eq(contacts.read, false));

  return {
    total: allResult.length,
    unread: unreadResult.length,
  };
}
