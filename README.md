# ServerSim: Interactive Server Architecture Simulator

ServerSim is a visual, browser-based server load simulation tool built with React and React Flow. It allows you to design web architectures by dragging and dropping various node types (Frontend, API Gateway, Load Balancer, Services, Databases, Caches, etc.) and simulating traffic flowing through them in real-time.


## 🌟 Key Features

*   **Interactive Architecture Canvas:** Design systems using a drag-and-drop node interface.
*   **8 Specialized Node Types:**
    *   **Frontend Client:** Generate simulated traffic (steady, spike, wave, etc.).
    *   **CDN Edge:** Simulate caching at the edge to offload traffic.
    *   **API Gateway:** Handle rate limiting, routing, and circuit breaking.
    *   **Load Balancer:** Distribute traffic using various algorithms (Round Robin, Least Connections, etc.).
    *   **Service (Compute):** Process requests with configurable CPU, RAM, and Auto-Scaling.
    *   **Message Queue:** Asynchronous task handling with producers and consumers.
    *   **Cache:** In-memory key-value stores with tunable hit rates to shield databases.
    *   **Database:** Persistent storage with read/write latencies and connection limits.
*   **Real-Time Simulation Engine:** Watch requests flow through your architecture, accumulating latency and tracking errors.
*   **Rich Presets:** 12+ built-in scenarios ranging from simple APIs to massive global enterprise deployments (and their catastrophic failure counterparts).
*   **Chaos Engineering:** Inject real-time faults (DDoS spikes, cache purges, network partitions) using the Chaos Panel.
*   **Live Metrics & Analytics:** 
    *   Global Dashboard: Track overall RPS, P50/P95 Latency, and Error Rates.
    *   Historical Node Charts: View 60-second rolling charts for individual components.
*   **Cloud Cost Simulator:** Get real-time estimates of how much your designed architecture would cost to run monthly.
*   **Auto-Scaling:** Watch your compute nodes dynamically spin up or shut down instances based on simulated CPU utilization.

## 🚀 Live Demo

You can try out ServerSim directly in your browser:
**[View Live Demo on GitHub Pages](https://nanthawat-nurod.github.io/server-load-simulation/)**

## 🛠️ Built With

*   **React 18**
*   **TypeScript**
*   **Vite** - Build tool
*   **React Flow (xyflow)** - Node-based interactive canvas
*   **Zustand** - State management
*   **Tailwind CSS** - Styling
*   **Recharts** - Historical data visualization
*   **Lucide React** - Icons

## 💻 Running Locally

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Nanthawat-Nurod/server-load-simulation.git
    cd server-load-simulation
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:
```bash
npm run build
```
The compiled static assets will be located in the `dist` directory.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
