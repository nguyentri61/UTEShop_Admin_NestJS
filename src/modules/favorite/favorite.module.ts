import { Module } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "src/modules/favorite/favorite.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
