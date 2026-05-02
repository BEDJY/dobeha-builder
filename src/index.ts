import { Client } from '@neondatabase/serverless';

export interface Env {
  DATABASE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = new Client(env.DATABASE_URL);
    
    // Configuración de cabeceras para JSON y CORS (para Flutter)
    const jsonHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    try {
      // Intentamos conectar a Neon
      await client.connect();
      
      // Ejemplo: Una consulta a tu base de datos
      const result = await client.query('SELECT NOW() as server_time');

      // Si todo sale bien, devolvemos el JSON con los datos
      return new Response(
        JSON.stringify({
          success: true,
          message: "Conexión exitosa",
          data: result.rows[0]
        }),
        { status: 200, headers: jsonHeaders }
      );

    } catch (error: any) {
      // Si Neon da error (credenciales mal, base de datos caída, etc.)
      // Capturamos el error y lo enviamos como JSON
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error de base de datos",
          detail: error.message // Aquí verás el error real que lanza Neon
        }),
        { status: 500, headers: jsonHeaders }
      );

    } finally {
      // Muy importante: Cerramos la conexión siempre
      await client.end();
    }
  },
};
