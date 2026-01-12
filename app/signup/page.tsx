"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [hotelName, setHotelName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: hotelName, // Storing hotel name as 'full_name' initially or metadata
                    },
                },
            })

            if (error) {
                toast.error("Error al crear cuenta", {
                    description: error.message,
                })
                return
            }

            toast.success("Cuenta creada exitosamente", {
                description: "Redirigiendo...",
            })

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            toast.error("Algo salió mal", {
                description: "Por favor intenta de nuevo más tarde",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-4 left-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">SS</span>
                    </div>
                    <span className="font-semibold">Smart Stay</span>
                </Link>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Crear Cuenta</CardTitle>
                    <CardDescription>Comienza gratis, sin tarjeta de crédito</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hotelName">Nombre del Hotel</Label>
                            <Input
                                id="hotelName"
                                type="text"
                                placeholder="Hotel Vista Lago"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@hotel.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Al crear una cuenta, aceptas nuestros{" "}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                                Términos de Servicio
                            </Link>{" "}
                            y{" "}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                                Política de Privacidad
                            </Link>
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                        </Button>
                        <p className="text-sm text-center text-gray-600">
                            ¿Ya tienes cuenta?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Iniciar sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
