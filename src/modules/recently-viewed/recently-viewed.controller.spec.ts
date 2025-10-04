import { Test, TestingModule } from "@nestjs/testing";
import { RecentlyViewedController } from "./recently-viewed.controller";

describe("RecentlyViewedController", () => {
  let controller: RecentlyViewedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentlyViewedController],
    }).compile();

    controller = module.get<RecentlyViewedController>(RecentlyViewedController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
