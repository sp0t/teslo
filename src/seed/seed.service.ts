import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('ProductService');

  constructor(private readonly productService: ProductsService) {}

  async runSeed() {
    const result = await this.insertNewProducts();
    return result;
  }

  private async insertNewProducts() {
    try {
      await this.productService.deleteAllProducts();
      const products = initialData.products;

      const insertPromises = [];

      products.forEach((product) => {
        insertPromises.push(this.productService.create(product));
      });

      const result = await Promise.all(insertPromises);

      return result;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
