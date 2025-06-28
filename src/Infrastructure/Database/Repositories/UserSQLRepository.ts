import { UserRepository } from '@/Application/Contracts/Repositories/UserRepository'
import { db } from '../Drizzle/DrizzleClient'
import { emails_table, users_table } from '../Schemas/Schemas'
import { getISOFormatDateQuery } from '../Helpers/Helpers'
import { eq } from 'drizzle-orm'
import { SignUpParams } from '@/Domain/Authentication/UseCases/SignUp'
import { PartialUser, User } from '@/Domain/Users/Models/User'

export class UserSQLRepository implements UserRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(emails_table)
      .where(eq(emails_table.email, email))
      .leftJoin(users_table, eq(users_table.email_id, emails_table.id))

    if (result[0]?.users_table) {
      return {
        email: result[0].emails_table.email,
        first_name: result[0].users_table.first_name,
        id: result[0].users_table.id,
        last_name: result[0].users_table.last_name,
        password: result[0].users_table.password,
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

  async createUser(params: SignUpParams): Promise<PartialUser> {
    const result = await db.transaction(async (tx) => {
      const emailTransaction = await tx
        .insert(emails_table)
        .values({ email: params.email })
        .returning({ email_id: emails_table.id, email: emails_table.email })
      return await tx
        .insert(users_table)
        .values({
          password: params.password,
          last_name: params.last_name,
          first_name: params.first_name,
          email_id: emailTransaction[0].email_id
        })
        .returning({
          id: users_table.id,
          created_at: getISOFormatDateQuery(users_table.created_at),
          updated_at: getISOFormatDateQuery(users_table.updated_at)
        })
    })

    return {
      id: result[0].id,
      updated_at: result[0].updated_at,
      created_at: result[0].created_at,
      email: params.email,
      first_name: params.first_name,
      last_name: params.last_name
    }
  }
}
