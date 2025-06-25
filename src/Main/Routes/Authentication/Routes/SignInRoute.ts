import { SignInUseCase } from '@/Application/Modules/Authentication/UseCases/SignInUseCase'
import { SignInController } from '@/Presentation/Controllers/SignInController/SignInController'
import { bcryptAdapter, jwtAdapter } from '@/Main/Dependencies/Infrastructure'
import { z } from 'zod'
import { ZodAdapter } from '@/Main/Libs/Zod/ZodAdapter'
import { SignInParams } from '@/Domain/Authentication/UseCases/SignIn'
import { userRepository } from '../Dependencies/UserRepository'

const signInUseCause = new SignInUseCase(
  userRepository,
  bcryptAdapter,
  jwtAdapter
)

const signInSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty()
}) satisfies z.Schema<SignInParams>

const signInValidation = new ZodAdapter(signInSchema)

export const signInController = new SignInController(
  signInUseCause,
  signInValidation
)
