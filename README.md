# Product Sync API

This project is a Node.js-based backend API built with the [NestJS](https://nestjs.com/) framework, using both **MongoDB** and **PostgreSQL** for storing product data fetched from the **Contentful API**. The application is fully dockerized and provides both public and private modules to interact with the data.

## Features

1. **Sync with Contentful API**: The application fetches product data from Contentful at regular intervals and stores it in both MongoDB and PostgreSQL.
2. **API**: Offers pagination, filtering, and retrieval of products, insights and reports on product data, such as percentages of deleted products, products without prices, and custom reports.
4. **Soft Delete**: Soft deletion of products is implemented, ensuring that removed products do not reappear after the app is restarted.
5. **Database Integration**:
   - **MongoDB**: Used for flexible and scalable data storage.
   - **PostgreSQL**: Used for relational data storage with strong data integrity.
6. **Dockerized**: The application is containerized using Docker and managed with a \`docker-compose\` file.

## Technologies

- **NestJS**: A progressive Node.js framework.
- **MongoDB**: NoSQL database for flexible data storage.
- **PostgreSQL**: Relational database for structured data.
- **TypeORM**: ORM for interacting with PostgreSQL.
- **Mongoose**: ODM for interacting with MongoDB.
- **Contentful API**: Source of product data.
- **Docker**: Containerization of the API, databases, and services.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Contentful credentials (space ID, access token, environment, and content type)

## Setup and Installation

1. **Clone the repository**:
   \`\`\`bash
   git clone <repository-url>
   cd ProductSyncApi
   \`\`\`

2. **Create a \`.env\` file** in the root directory with the following variables:

   \`\`\`bash
   MONGODB_URI=mongodb://root:example@mongodb:27017/productsync?authSource=admin
   PORT=3000
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_ENVIRONMENT=your_environment
   CONTENTFUL_CONTENT_TYPE=product
   POSTGRES_USER=root
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=products
   POSTGRES_PORT=5432
   POSTGRES_HOST=postgresdb
   \`\`\`

3. **Build and run the services** using Docker Compose:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

   This will set up the API, MongoDB, and PostgreSQL services.

4. **Access the application**:
   - API will be accessible on \`http://localhost:3000\`
   - MongoDB will be accessible on \`mongodb://localhost:27017\`
   - PostgreSQL will be accessible on \`postgresql://localhost:5432\`

## Endpoints

### Public Endpoints

- **Sync products from Contentful to MongoDB**:
  \`\`\`bash
  GET /api/products/sync
  \`\`\`

- **Get paginated products**:
  \`\`\`bash
  GET /api/products?page={page}&limit={limit}
  \`\`\`

- **Get products by price range**:
  \`\`\`bash
  GET /api/products/price-range?minPrice={minPrice}&maxPrice={maxPrice}
  \`\`\`

- **Get products by date range**:
  \`\`\`bash
  GET /api/products/date-range?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}
  \`\`\`

- **Get products with low stock**:
  \`\`\`bash
  GET /api/products/low-stock
  \`\`\`

### Private Endpoints (JWT Authentication Required)

- **Delete a product by ID**:
  \`\`\`bash
  DELETE /api/products/:id
  \`\`\`

- **Sync products from Contentful to PostgreSQL**:
  \`\`\`bash
  GET /api/products-postgres/sync
  \`\`\`

- **Private reports**:
  These require JWT authentication in the request headers.

### JWT Authentication

Private endpoints require JWT authentication. Obtain a JWT token by implementing a proper authentication flow or set up mock authentication for testing purposes.

## Soft Delete

The application implements a soft delete mechanism:
- Products marked as deleted are not physically removed from the database.
- These deleted products do not reappear when the app restarts.

## Database Structure

### MongoDB

A flexible schema with Mongoose ODM, suitable for handling varied product data:

```typescript
export const ProductSchema = new Schema<Product>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  productModel: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }, // For soft delete
});
```

### PostgreSQL

A relational schema using TypeORM for structured data storage:

```typescript
@Entity('products')
export class ProductPostgres {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  productModel: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column('decimal')
  price: number;

  @Column()
  currency: string;

  @Column()
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

## License

This project is licensed under the MIT License.
