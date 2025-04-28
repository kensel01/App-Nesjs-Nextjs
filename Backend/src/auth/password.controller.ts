import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}

@ApiTags('Auth')
@Controller('auth')
export class PasswordController {
  // Endpoint to request a password reset
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Más estricto aún: 3 intentos por minuto
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    // Simulate a lookup for the user and token generation
    // In production, you would query the database and store the reset token
    const token = 'fake-reset-token-' + Math.random().toString(36).substr(2, 9);
    console.log(`Password reset token for ${email}: ${token}`);
    // Simulate sending email with the reset link
    // For simulation, we simply log the token
    return {
      message:
        'Si el correo está registrado, recibirás un enlace para restablecer la contraseña.',
    };
  }

  // Endpoint to reset the password using the token
  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Más estricto aún: 3 intentos por minuto
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { token, newPassword } = body;
    // Simulate token verification and password update
    console.log(
      `Reset password requested with token: ${token} and newPassword: ${newPassword}`,
    );
    // In production, verify token validity and update the user password in the database
    return { message: 'La contraseña ha sido restablecida exitosamente.' };
  }
}
