# api-registro-ciudadano


Prisma CLI tiene varios comandos útiles para gestionar bases de datos y el ORM. Aquí te dejo los principales:

📌 Comandos principales de Prisma CLI

prisma init
Inicializa Prisma en tu proyecto, creando el archivo prisma/schema.prisma.

npx prisma generate
Genera el cliente de Prisma a partir del archivo schema.prisma.

prisma migrate dev --name <nombre>
Crea y aplica una migración en desarrollo.

prisma migrate deploy
Aplica todas las migraciones en producción.

prisma migrate reset
Borra la base de datos y reaplica las migraciones desde cero.

npx prisma db push
Aplica cambios en schema.prisma directamente a la base de datos sin migraciones.

prisma db seed
Ejecuta el script de seed para poblar la base de datos con datos iniciales.

prisma db pull
Sincroniza el schema.prisma con la estructura actual de la base de datos.

prisma studio
Abre Prisma Studio, una interfaz web para visualizar y editar datos.

prisma format
Formatea el archivo schema.prisma.

prisma validate
Verifica si schema.prisma tiene errores.

prisma --help
Muestra todos los comandos disponibles.

