# System Requirement

-   WSL2 in Windows
-   Docker running in WSL2

# Development Setup

Follow this if you are PS developer or need to modify the project source code

-   [Setup Database](#database-setup)
-   Add nexus registry for pulling base image to Docker Settings > Docker Engine > insecure-registries
    ```
    "insecure-registries": [
        "nexus01.leekie.com:8085"
    ],
    ```
-   Run `bash ./docker/init` to setup necessary dependencies and files for development
-   Edit [.env and .env.api files](#env-file) inside project directory root
-   Run `sail up` to start developement service
    ```
    NOTE: Setup Dummy SBO in your local to test zircon PS after login features.
    TIP: Read more about laravel sail, docker, docker-compose commands.
    ```
-   Start to code!

# Build Setup

**Production/Other Developer Team setup:**

Follow this to setup PS from official docker image.

-   NO SETUP YET

**Zircon PS Developer Local Testing**

-   Run command `bash ./docker/build -p <PORT IN LOCAL>:80`

# .ENV FILES

-   Search for all config with comment "# \*", those are configs that needs attention on development only
    and can be removed in production.
-   Search for all config with comment "# \*\*", those are configs that needs attention on development until production.
-   Other configs without the above comments may be left as it is.

# Database Setup

-   Copy zircon database from STG
-   Set zircon.application 'Player Site' URLs to your local
