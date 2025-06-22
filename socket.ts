import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for development)
    methods: ["GET", "POST"]
  }
});

// Socket.IO events
io.on('connection', (socket: Socket) => {
  console.log('✅ A user connected:', socket.id);

  // pengiriman baru ke admin
  socket.on('pengiriman_baru_server', (data: any) => {

    // Echo the data back to all clients
    io.emit('pengiriman_baru_client', "coba");
  });

  // pembatalan paket dari admin ke user
  socket.on("pembatalan_paket", (data: any) => {
    console.log(data);
    io.emit("pembatalan_paket_"+data.id_pengirim, data);
  })

// pembatalan paket dari kurir ke user
  socket.on("pembatalan_paket_kurir", (data: any) => {
    console.log(data, "pembatalan_paket_kurir");
    io.emit("pembatalan_paket_kurir", data);
    io.emit("pembatalan_paket_kurir_"+data.id_pengirim, data);
  })

  // penugaskan kurir dan notif ke user
  socket.on("tugaskan_kurir_server", (data: any) => {
    console.log(data);

    io.emit("kurir_ditugaskan_"+data.id_pengirim, data); // hantar notif kepada user
    io.emit("kurir_ditugaskan_"+data.id_kurir, data); // hantar notif kepada kurir

    // io.emit("pembatalan_paket_"+data.id_pengirim, data);
  })

  // kuris ditugaskan dan dalam perjalanan mengambil pake , notif ke user dan admin
  socket.on("kurir_mengambil_pengiriman", (data: any) => {
    console.log("kurir_mengambil_pengiriman",data);

    io.emit("kurir_mengambil_pengiriman_"+data.id_pengirim, data); // hantar notif kepada user
    io.emit("kurir_mengambil_pengiriman_admin", data); // hantar notif kepada admin
  })

  // kurir mengambil paket dari pengirim dan menghantar ke alamat penerima, notif ke user dan admin
  socket.on("kurir_menghantar_ke_penerima", (data: any) => {
    console.log("kurir_menghantar_ke_penerima",data);

    io.emit("kurir_menghantar_ke_penerima_"+data.id_pengirim, data); // hantar notif kepada user
    io.emit("kurir_menghantar_ke_penerima_admin", data); // hantar notif kepada admin
  })

  // user verifikasi penerimaan paket, mengirim notifikasi kepada admin
  socket.on("diterima_terverifikasi", (data: any) => {
    console.log("diterima_terverifikasi",data);

    io.emit("diterima_terverifikasi_admin", data); // hantar notif kepada admin
  })

   // user verifikasi penerimaan paket, mengirim notifikasi kepada admin
  socket.on("delete_kiriman", (data: any) => {
    console.log("delete_kiriman",data);

    io.emit("delete_kiriman_admin", data); // hantar notif kepada admin
  })



  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = 3014;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
