import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/user/user.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProductModule } from "./modules/product/product.module";
import { OrderModule } from "./modules/order/order.module";
import { ProductImageModule } from "./modules/product-image/product-image.module";
import { ProductVariantModule } from "./modules/product-variant/product-variant.module";
import { CartItemModule } from "./modules/cart-item/cart-item.module";
import { OrderItemModule } from "./modules/order-item/order-item.module";
import { CouponModule } from "./modules/coupon/coupon.module";
import { ReviewModule } from "./modules/review/review.module";
import { FavoriteModule } from "./modules/favorite/favorite.module";
import { RecentlyViewedModule } from "./modules/recently-viewed/recently-viewed.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "ute_shop_db",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false,
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    ProductImageModule,
    ProductVariantModule,
    CartItemModule,
    OrderItemModule,
    CouponModule,
    ReviewModule,
    FavoriteModule,
    RecentlyViewedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
