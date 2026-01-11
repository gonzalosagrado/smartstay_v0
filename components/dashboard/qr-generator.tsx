"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRGeneratorProps {
  url: string
  hotelName: string
}

export function QRGenerator({ url, hotelName }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
    }
  }, [url])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `${hotelName.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Portal QR Code</CardTitle>
        <CardDescription>Share this QR code with guests to access the portal</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="rounded-lg border" />
        <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  )
}
