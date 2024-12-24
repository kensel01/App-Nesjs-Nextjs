"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';

interface Cliente {
    id: number;
    name: string;
}

interface Tecnico {
    id: number;
    name: string;
}

interface EstadoPago {
    id: number;
    status: string;
}

const DashboardPage = () => {
    const { data: session, status } = useSession();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    const [estadosPago, setEstadosPago] = useState<EstadoPago[]>([]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchClientes();
            fetchTecnicos();
            fetchEstadosPago();
        }
    }, [status]);

    const fetchClientes = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clientes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.token}`,
            },
        });
        const data = await res.json();
        setClientes(data);
    };

    const fetchTecnicos = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tecnicos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });
            const data = await res.json();
            console.log('Response from /tecnicos:', data);
            if (Array.isArray(data)) {
                setTecnicos(data);
            } else {
                console.error('Expected an array of tecnicos');
            }
        } catch (error) {
            console.error('Error fetching tecnicos:', error);
        }
    };

    const fetchEstadosPago = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/estados-pago`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.token}`,
            },
        });
        const data = await res.json();
        console.log('Response from /estados-pago:', data);
        setEstadosPago(data);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>Clientes</h2>
                <ul>
                    {clientes.map(cliente => (
                        <li key={cliente.id}>{cliente.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Técnicos</h2>
                <ul>
                    {tecnicos.map(tecnico => (
                        <li key={tecnico.id}>{tecnico.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Estados de Pago</h2>
                <ul>
                    {estadosPago.map(estado => (
                        <li key={estado.id}>{estado.status}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;   
