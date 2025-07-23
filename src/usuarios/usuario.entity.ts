import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Prestamo } from '../prestamos/prestamo.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'usuario' })
    role: string; // 'usuario', 'bibliotecario', 'administrador'

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Prestamo, prestamo => prestamo.usuario)
    prestamos: Prestamo[];
}
