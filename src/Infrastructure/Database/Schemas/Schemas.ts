import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

const baseSchema = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
}

export const users_table = pgTable('users_table', {
  ...baseSchema,
  email_id: integer().notNull(),
  username_id: integer().notNull(),
  password: varchar({ length: 255 }).notNull(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull()
})

export const usernames_table = pgTable('usernames_table', {
  ...baseSchema,
  username: varchar({ length: 255 }).notNull().unique()
})

export const emails_table = pgTable('emails_table', {
  ...baseSchema,
  email: varchar({ length: 255 }).notNull().unique()
})
