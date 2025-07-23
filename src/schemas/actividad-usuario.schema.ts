import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ActividadUsuario extends Document {
  @Prop({ required: true })
  usuarioId: number;

  @Prop({ required: true })
  accion: string; // 'login', 'logout', 'prestamo', 'devolucion', etc.

  @Prop({ required: true })
  descripcion: string;

  @Prop()
  libroId?: number;

  @Prop()
  prestamoId?: number;

  @Prop({ default: Date.now })
  fecha: Date;

  @Prop()
  metadata?: Record<string, any>;
}

export const ActividadUsuarioSchema = SchemaFactory.createForClass(ActividadUsuario);
