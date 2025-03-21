-- CreateTable
CREATE TABLE "Persona" (
    "id" SERIAL NOT NULL,
    "cuit" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "nacionalidad" TEXT,
    "sexo" CHAR(1),
    "estadoCivil" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domicilio" (
    "id" SERIAL NOT NULL,
    "personaId" INTEGER NOT NULL,
    "calle" TEXT,
    "numero" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "pais" TEXT,
    "codigoPostal" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domicilio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefono" (
    "id" SERIAL NOT NULL,
    "personaId" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipo" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Telefono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "personaId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Persona_cuit_key" ON "Persona"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Domicilio_personaId_key" ON "Domicilio"("personaId");

-- AddForeignKey
ALTER TABLE "Domicilio" ADD CONSTRAINT "Domicilio_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefono" ADD CONSTRAINT "Telefono_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
