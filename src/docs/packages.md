# Create the project from scratch

<p>
create a folder ( name = create_backend_server)
</p>

<p>
initialize the node project and create package.json using this command on terminal and choose blank template.
</p>     
<p>

       bun init

</p>
       
       bunx init -y
</p>
<h2>
1. create "src" folder & create a file name "app.ts" &  "server.ts"
</h2>
<p>

    mkdir src && cd src &&  echo.> app.ts && echo.> server.ts && cd ..

</p>

<p>
    Install dependencies
</p>

    bun add fastify dotenv bcryptjs fastify-plugin @fastify/cors @fastify/cookie @fastify/rate-limit @fastify/http-proxy

<p>

<p>
    Install Development dependencies
</p>
</p>

    bun add --dev rimraf prettier

<p>
<p>
    Install type dev dependencies
</p>
</p>

    bun add --dev

<p>

<p>

    "scripts": {
        "build": "rimraf dist && bun build --entrypoints ./src/server.ts --outdir ./dist --format esm --splitting --minify --target node",
        "prestart": "bun run build",
        "start": "bun ./dist/server.js",
        "dev": "bun run --watch ./src/server.ts",
        "prettier": "prettier --write ."
    },

</p>

<p>Adding mysql & redis database packages to create and connect database
</p>

<p>
    
    bun add sequelize mysql2 pg-hstore @upstash/redis

</p>

<p>Adding email setup and otp authentication </p>

<p>
    
    bun add nodemailer ejs jsonwebtoken

</p>
<p>
    
    bun add --dev @types/nodemailer @types/ejs @types/jsonwebtoken

</p>
