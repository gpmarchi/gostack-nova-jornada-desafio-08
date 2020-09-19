import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid customer provided.', 400);
    }

    const productsIds = products.map(product => ({
      id: product.id,
    }));

    const existentProducts = await this.productsRepository.findAllById(
      productsIds,
    );

    if (existentProducts.length === 0) {
      throw new AppError('You must order valid products.', 400);
    }

    const updatedProductQuantities: IProduct[] = [];

    const purchasedProducts = existentProducts.map(existentProduct => {
      const purchasedProductWithQuantity = products.find(
        product => product.id === existentProduct.id,
      );

      if (
        purchasedProductWithQuantity &&
        purchasedProductWithQuantity.quantity > existentProduct.quantity
      ) {
        throw new AppError('Purchased quantity exceeds stock available.', 400);
      }

      const purchasedQuantity = purchasedProductWithQuantity
        ? purchasedProductWithQuantity.quantity
        : 0;

      const purchasedProduct = {
        product_id: existentProduct.id,
        price: existentProduct.price,
        quantity: purchasedQuantity,
      };

      updatedProductQuantities.push({
        id: existentProduct.id,
        quantity: existentProduct.quantity - purchasedQuantity,
      });

      return purchasedProduct;
    });

    const order = await this.ordersRepository.create({
      customer,
      products: purchasedProducts,
    });

    await this.productsRepository.updateQuantity(updatedProductQuantities);

    return order;
  }
}

export default CreateOrderService;
