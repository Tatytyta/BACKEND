import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Resena extends Document {
  @Prop({ required: true })
  usuarioId: number;

  @Prop({ required: true })
  libroId: number;

  @Prop({ required: true, min: 1, max: 5 })
  calificacion: number;

  @Prop({ required: true })
  comentario: string;

  @Prop({ default: Date.now })
  fechaResena: Date;
}

export const ResenaSchema = SchemaFactory.createForClass(Resena);
