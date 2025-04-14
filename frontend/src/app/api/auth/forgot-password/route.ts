import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    console.log('Password reset requested for:', email);
    // Here you would normally trigger an email with recovery instructions
    return NextResponse.json({ message: 'Instrucciones de recuperación enviadas al email si existe en nuestros registros.' });
  } catch (error) {
    console.error('Error processing forgot-password request:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Endpoint para recuperación de contraseña' });
} 