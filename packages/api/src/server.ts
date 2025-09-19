import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

const app = express();

// Simple in-memory data
let products = [
    { id: '1', name: 'T-Shirt', price: 25.99, category: 'Clothing' },
    { id: '2', name: 'Jeans', price: 79.99, category: 'Clothing' },
    { id: '3', name: 'Sneakers', price: 89.99, category: 'Shoes' }
];

// GraphQL Schema
const typeDefs = `
  type Query {
    hello: String!
    products: [Product!]!
    product(id: ID!): Product
  }
  
  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
  
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
  }
  
  input CreateProductInput {
    name: String!
    price: Float!
    category: String!
  }
`;

// GraphQL Resolvers
const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL!',
        products: () => {
            console.log('Products query called, returning:', products);
            return products;
        },
        product: (_: any, { id }: any) => {
            console.log('Product query called with id:', id);
            return products.find(p => p.id === id);
        }
    },
    Mutation: {
        createProduct: (_: any, { input }: any) => {
            console.log('Creating product with input:', input);
            const newProduct = {
                id: String(Date.now()), // Simple ID generation
                ...input
            };
            products.push(newProduct);
            console.log('Created product:', newProduct);
            return newProduct;
        },
        deleteProduct: (_: any, { id }: any) => {
            console.log('Deleting product with id:', id);
            const initialLength = products.length;
            products = products.filter(p => p.id !== id);
            const deleted = products.length < initialLength;
            console.log('Product deleted:', deleted);
            return deleted;
        }
    }
};

async function startServer() {
    // Middleware
    app.use(cors());
    app.use(express.json());

    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        debug: true, // Enable debug mode
    });

    await server.start();
    server.applyMiddleware({ app: app as any, path: '/graphql' });

    // Test endpoints
    app.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            message: 'Server is running!',
            graphql: '/graphql'
        });
    });

    app.get('/test-products', (req, res) => {
        res.json({ products });
    });

    const PORT = 4000;

    app.listen(PORT, () => {
        console.log('\n🚀 SERVER STARTED SUCCESSFULLY!');
        console.log(`📍 GraphQL Playground: http://localhost:${PORT}/graphql`);
        console.log(`💚 Health Check: http://localhost:${PORT}/health`);
        console.log(`📦 Test Products: http://localhost:${PORT}/test-products`);
        console.log('\n✅ Ready for GraphQL queries!\n');
    });
}

startServer().catch(error => {
    console.error('❌ Server failed to start:', error);
});