package com.foodhub.controller;

import com.foodhub.repository.FoodRepository;
import com.foodhub.repository.OrderRepository;
import com.foodhub.repository.RestaurantRepository;
import com.foodhub.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;

    public RootController(UserRepository userRepository,
                          RestaurantRepository restaurantRepository,
                          FoodRepository foodRepository,
                          OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String dashboardHtml() {
        long userCount = userRepository.count();
        long restaurantCount = restaurantRepository.count();
        long foodCount = foodRepository.count();
        long orderCount = orderRepository.count();

        String html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FoodHub Backend API - Control Center</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --bg: #090d16;
                    --card-bg: rgba(22, 29, 47, 0.75);
                    --card-border: rgba(255, 255, 255, 0.08);
                    --primary: #f97316;
                    --primary-glow: rgba(249, 115, 22, 0.25);
                    --success: #10b981;
                    --accent: #3b82f6;
                    --text: #f8fafc;
                    --text-muted: #94a3b8;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
                    background-color: var(--bg);
                    background-image:
                        radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.12) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%);
                    color: var(--text);
                    min-height: 100vh;
                    padding: 2.5rem 1.5rem;
                }
                .container { max-width: 1100px; margin: 0 auto; }
                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--card-border);
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .brand { display: flex; align-items: center; gap: 1rem; }
                .logo-icon {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #f97316, #ef4444);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    box-shadow: 0 8px 20px var(--primary-glow);
                }
                h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }
                .subtitle { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.2rem; }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(16, 185, 129, 0.12);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 9999px;
                    color: #34d399;
                    font-weight: 600;
                    font-size: 0.85rem;
                }
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }

                .grid-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1.25rem;
                    margin-bottom: 2rem;
                }
                .card {
                    background: var(--card-bg);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--card-border);
                    border-radius: 18px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
                }
                .stat-num { font-size: 2.2rem; font-weight: 800; color: #fff; margin-top: 0.25rem; }
                .stat-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }

                .action-bar {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.85rem 1.4rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    border: none;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    color: white;
                    box-shadow: 0 6px 18px var(--primary-glow);
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(249, 115, 22, 0.4); }
                .btn-secondary {
                    background: rgba(255, 255, 255, 0.06);
                    color: var(--text);
                    border: 1px solid var(--card-border);
                }
                .btn-secondary:hover { background: rgba(255, 255, 255, 0.12); transform: translateY(-2px); }

                .panel-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
                .endpoints-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .endpoint-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(10, 15, 28, 0.6);
                    border: 1px solid var(--card-border);
                    border-radius: 12px;
                    padding: 0.85rem 1.2rem;
                    transition: all 0.15s ease;
                }
                .endpoint-item:hover { border-color: rgba(249, 115, 22, 0.4); background: rgba(10, 15, 28, 0.85); }
                .method {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.25rem 0.55rem;
                    border-radius: 6px;
                }
                .get { background: rgba(59, 130, 246, 0.18); color: #60a5fa; }
                .post { background: rgba(16, 185, 129, 0.18); color: #34d399; }
                .url { font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; margin-left: 0.75rem; }
                .btn-try {
                    background: transparent;
                    color: var(--primary);
                    border: 1px solid var(--primary);
                    padding: 0.35rem 0.85rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .btn-try:hover { background: var(--primary); color: white; }

                #response-box {
                    margin-top: 1.5rem;
                    background: #05070e;
                    border: 1px solid var(--card-border);
                    border-radius: 14px;
                    padding: 1.25rem;
                    display: none;
                }
                #response-box pre {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    color: #e2e8f0;
                    max-height: 280px;
                    overflow: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }
                th, td {
                    text-align: left;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid var(--card-border);
                }
                th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
                code {
                    font-family: 'JetBrains Mono', monospace;
                    background: rgba(255, 255, 255, 0.06);
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    color: #fdba74;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div class="brand">
                        <div class="logo-icon">🍔</div>
                        <div>
                            <h1>FoodHub Backend API</h1>
                            <div class="subtitle">Spring Boot 3.3.4 &bull; Java 17/26 &bull; In-Memory H2 DB</div>
                        </div>
                    </div>
                    <div class="status-badge">
                        <div class="pulse-dot"></div>
                        <span>BACKEND ONLINE &bull; PORT 8080</span>
                    </div>
                </header>

                <div class="action-bar">
                    <a href="http://localhost:5173" target="_blank" class="btn btn-primary">
                        🚀 Open Frontend Website (localhost:5173)
                    </a>
                    <a href="/h2-console" target="_blank" class="btn btn-secondary">
                        🗄️ Open H2 Database Console
                    </a>
                    <a href="/api/restaurants" target="_blank" class="btn btn-secondary">
                        🍱 View Raw JSON (Restaurants)
                    </a>
                </div>

                <div class="grid-stats">
                    <div class="card">
                        <div class="stat-label">Active Restaurants</div>
                        <div class="stat-num">{{restaurants}}</div>
                    </div>
                    <div class="card">
                        <div class="stat-label">Dishes on Menu</div>
                        <div class="stat-num">{{foods}}</div>
                    </div>
                    <div class="card">
                        <div class="stat-label">Registered Users</div>
                        <div class="stat-num">{{users}}</div>
                    </div>
                    <div class="card">
                        <div class="stat-label">Orders Handled</div>
                        <div class="stat-num">{{orders}}</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <div class="card">
                        <div class="panel-title">⚡ Interactive API Explorer</div>
                        <div class="endpoints-list">
                            <div class="endpoint-item">
                                <div><span class="method get">GET</span><span class="url">/api/restaurants</span></div>
                                <button class="btn-try" onclick="testApi('/api/restaurants')">Test</button>
                            </div>
                            <div class="endpoint-item">
                                <div><span class="method get">GET</span><span class="url">/api/foods</span></div>
                                <button class="btn-try" onclick="testApi('/api/foods')">Test</button>
                            </div>
                            <div class="endpoint-item">
                                <div><span class="method get">GET</span><span class="url">/api/restaurants/1</span></div>
                                <button class="btn-try" onclick="testApi('/api/restaurants/1')">Test</button>
                            </div>
                            <div class="endpoint-item">
                                <div><span class="method get">GET</span><span class="url">/api/foods/category/Pizza</span></div>
                                <button class="btn-try" onclick="testApi('/api/foods/category/Pizza')">Test</button>
                            </div>
                        </div>

                        <div id="response-box">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.75rem; color:#94a3b8;">
                                <span id="res-target">RESPONSE</span>
                                <span id="res-status" style="color:#10b981; font-weight:700;">200 OK</span>
                            </div>
                            <pre id="response-content"></pre>
                        </div>
                    </div>

                    <div class="card">
                        <div class="panel-title">🔑 Pre-Seeded Demo Credentials</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span style="color:#38bdf8; font-weight:600;">Customer</span></td>
                                    <td><code>customer@foodhub.com</code></td>
                                    <td><code>password123</code></td>
                                </tr>
                                <tr>
                                    <td><span style="color:#fbbf24; font-weight:600;">Restaurant</span></td>
                                    <td><code>restaurant@foodhub.com</code></td>
                                    <td><code>password123</code></td>
                                </tr>
                                <tr>
                                    <td><span style="color:#f43f5e; font-weight:600;">Admin</span></td>
                                    <td><code>admin@foodhub.com</code></td>
                                    <td><code>password123</code></td>
                                </tr>
                                <tr>
                                    <td><span style="color:#a855f7; font-weight:600;">Delivery</span></td>
                                    <td><code>delivery@foodhub.com</code></td>
                                    <td><code>password123</code></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                            💡 <strong>H2 Database Credentials:</strong><br>
                            JDBC URL: <code>jdbc:h2:mem:foodhubdb</code> &bull; User: <code>sa</code> &bull; Password: <em>(blank)</em>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                async function testApi(endpoint) {
                    const box = document.getElementById('response-box');
                    const pre = document.getElementById('response-content');
                    const target = document.getElementById('res-target');
                    const status = document.getElementById('res-status');
                    target.textContent = 'FETCHING ' + endpoint + '...';
                    box.style.display = 'block';
                    try {
                        const res = await fetch(endpoint);
                        status.textContent = res.status + ' ' + res.statusText;
                        const data = await res.json();
                        target.textContent = endpoint;
                        pre.textContent = JSON.stringify(data, null, 2).slice(0, 3000);
                    } catch(err) {
                        status.textContent = 'ERROR';
                        pre.textContent = err.toString();
                    }
                }
            </script>
        </body>
        </html>
        """;

        return html
                .replace("{{restaurants}}", String.valueOf(restaurantCount))
                .replace("{{foods}}", String.valueOf(foodCount))
                .replace("{{users}}", String.valueOf(userCount))
                .replace("{{orders}}", String.valueOf(orderCount));
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> rootJson() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "Food Hub Backend API");
        response.put("message", "Backend is running successfully!");

        Map<String, String> links = new HashMap<>();
        links.put("frontend", "http://localhost:5173");
        links.put("restaurants", "http://localhost:8080/api/restaurants");
        links.put("foods", "http://localhost:8080/api/foods");
        links.put("h2Console", "http://localhost:8080/h2-console");

        response.put("endpoints", links);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/api", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_HTML_VALUE})
    public ResponseEntity<Map<String, Object>> api() {
        return rootJson();
    }
}
