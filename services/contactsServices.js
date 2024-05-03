import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });

  return JSON.parse(contacts);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();

  const contactToFind = contacts.find((contact) => contact.id === contactId);

  if (contactToFind === undefined) {
    return null;
  }

  return contactToFind;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactToRemove = contacts.find((contact) => contact.id === contactId);
  if (contactToRemove !== undefined) {
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contactToRemove;
  } else {
    return null;
  }
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const contactToAdd = {
    name,
    email,
    phone,
    id: nanoid(),
  };
}

export async function rewriteContact(id, contact) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  const updatedContact = { id, ...contact };

  contacts[index] = updatedContact;

  await rewriteContact(contacts);

  return updatedContact;
}
