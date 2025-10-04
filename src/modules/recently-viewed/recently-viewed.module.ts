import { Module } from "@nestjs/common";
import { RecentlyViewedService } from "./recently-viewed.service";
import { RecentlyViewedController } from "./recently-viewed.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecentlyViewed } from "src/modules/recently-viewed/recently-viewed.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RecentlyViewed])],
  providers: [RecentlyViewedService],
  controllers: [RecentlyViewedController],
})
export class RecentlyViewedModule {}
