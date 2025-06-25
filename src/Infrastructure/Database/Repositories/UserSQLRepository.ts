import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import { db } from '../Drizzle/DrizzleClient'
import { emails_table, usernames_table, users_table } from '../Schemas/Schemas'
import { getISOFormatDateQuery } from '../Helpers/Helpers'
import { eq } from 'drizzle-orm'
import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { LoggedInUser, User } from '@/Domain/Users/Models/User'

export class UserSQLRepository implements UserRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(emails_table)
      .where(eq(emails_table.email, email))
      .leftJoin(users_table, eq(users_table.email_id, emails_table.id))

    if (result[0]?.users_table) {
      return {
        ...result[0]?.users_table,
        created_at: result[0].users_table.created_at.toISOString(),
        updated_at: result[0].users_table.updated_at.toISOString()
      }
    }
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const result = await db
      .select()
      .from(emails_table)
      .where(eq(emails_table.email, email))
    return result.length > 0
  }

  async isUsernameInUse(username: string): Promise<boolean> {
    const result = await db
      .select()
      .from(usernames_table)
      .where(eq(usernames_table.username, username))
    return result.length > 0
  }

  async createUser(params: SignUpParams): Promise<LoggedInUser> {
    const result = await db.transaction(async (tx) => {
      const usernameTransaction = await tx
        .insert(usernames_table)
        .values({ username: params.username })
        .returning({ username_id: usernames_table.id })
      const emailTransaction = await tx
        .insert(emails_table)
        .values({ email: params.email })
        .returning({ email_id: emails_table.id })
      return await tx
        .insert(users_table)
        .values({
          password: params.password,
          last_name: params.last_name,
          first_name: params.first_name,
          username_id: usernameTransaction[0].username_id,
          email_id: emailTransaction[0].email_id
        })
        .returning({
          id: users_table.id,
          last_name: users_table.last_name,
          first_name: users_table.first_name,
          username_id: users_table.username_id,
          email_id: users_table.email_id,
          created_at: getISOFormatDateQuery(users_table.created_at),
          updated_at: getISOFormatDateQuery(users_table.updated_at)
        })
    })
    return result[0]
  }
}
