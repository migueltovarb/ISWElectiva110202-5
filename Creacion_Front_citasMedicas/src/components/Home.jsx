import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, UserPlus, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-blue-800 mb-4"
        >
        Bienvenido a MedGestión
        </motion.h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-xl mb-6">
        Tu portal seguro para agendar, consultar y administrar tus citas médicas de forma sencilla y rápida.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
        <Button className="flex items-center gap-2 text-lg px-6 py-4">
            <UserPlus size={20} />
            Registrarse
        </Button>
        <Button variant="outline" className="flex items-center gap-2 text-lg px-6 py-4">
            <Calendar size={20} />
            Agendar Cita
        </Button>
        <Button variant="ghost" className="flex items-center gap-2 text-lg px-6 py-4 text-blue-700">
            <Stethoscope size={20} />
            Ver Médicos
        </Button>
        </div>

        <footer className="mt-12 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MedGestión. Todos los derechos reservados.
        </footer>
    </div>
    )
}
export default Home;