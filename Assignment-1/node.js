const http = require("http");
const fs = require("fs");
const PORT = 3000;
if (!fs.existsSync("students.json")) {
    fs.writeFileSync("students.json", "[]");
}
const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(`
            <h1>Welcome to Student Record System</h1>
            <form method="POST" action="/add">
                Student Name:
                <input type="text" name="name" required>
                <br><br>
                Roll Number:
                <input type="text" name="roll" required>
                <br><br>
                Course:
                <input type="text" name="course" required>
                <br><br>
                Email:
                <input type="email" name="email" required>
                <br><br>
                <button type="submit">Add Student</button>
            </form>
            <br>
            <a href="/students">View Student Records</a>
        `);
    }
    else if (req.method === "POST" && req.url === "/add") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            const data = {};
            body.split("&").forEach(item => {
                const [key, value] = item.split("=");
                data[key] = decodeURIComponent(
                    value.replace(/\+/g, " ")
                );
            });
            fs.readFile("students.json", "utf8", (err, fileData) => {
                let students = [];
                if (!err && fileData) {
                    students = JSON.parse(fileData);
                }
                students.push({
                    name: data.name,
                    roll: data.roll,
                    course: data.course,
                    email: data.email
                });
                fs.writeFile(
                    "students.json",
                    JSON.stringify(students, null, 2),
                    err => {
                        if (err) {
                            res.writeHead(500);
                            res.end("Error saving student");
                            return;
                        }
                        res.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        res.end(`
                            <h2>Student Added Successfully!</h2>
                            <a href="/">Add Another Student</a>
                            <br><br>
                            <a href="/students">View Student Records</a>
                        `);
                    }
                );
            });
        });
    }
    else if (req.method === "GET" && req.url === "/students") {
        fs.readFile("students.json", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error reading students");
                return;
            }
            const students = JSON.parse(data);
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            let html = `
                <h1>Student Records</h1>
                <table border="1" cellpadding="10">
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Course</th>
                        <th>Email</th>
                    </tr>
            `;
            students.forEach(student => {
                html += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.course}</td>
                        <td>${student.email}</td>
                    </tr>
                `;
            });
            html += `
                </table>
                <br>
                <a href="/">Add Student</a>
            `;
            res.end(html);
        });
    }
    else {
        res.writeHead(404);
        res.end("404 - Page Not Found");
    }
});
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});