import type { AppLocale } from "./i18n-context";
import type { ShopProduct } from "../../types";

type LocalizedProductText = {
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  badge: string;
  category: string;
  specs: ShopProduct["specs"];
};

const productTranslations: Record<string, Partial<Record<AppLocale, LocalizedProductText>>> = {
  "petai-bear": {
    vn: {
      name: "Gấu PetAI",
      tagline: "Phiên bản Bắc Cực Sentient",
      shortDescription: "Điềm tĩnh, chở che và ấm áp. Một điểm tựa cảm xúc lý tưởng bên giường ngủ.",
      description:
        "Gấu PetAI được thiết kế như một người bạn đồng hành vững vàng và điềm tĩnh, với lớp vỏ mềm tông bắc cực, đôi mắt phát sáng theo nhịp tim và lớp lưới neural cảm ứng phản hồi theo sự hiện diện lẫn sắc thái giọng nói.",
      longDescription:
        "Đây là plush companion cao cấp dành cho những buổi tối chậm rãi, cân bằng cảm xúc và cảm giác an tâm luôn hiện diện. Gấu PetAI kết hợp lõi giọng nói độ trung thực cao cùng mô-đun khoảng cách, chạm và ký ức cảm xúc để mỗi lần tương tác ngày càng cá nhân hơn.",
      badge: "BÁN CHẠY",
      category: "Thú nhồi bông Neural",
      specs: [
        { icon: "mic", label: "Lưới cảm ứng", value: "Cảm nhận cảm xúc qua chạm" },
        { icon: "volume_up", label: "Lõi giọng nói", value: "Phản hồi ấm áp, độ trễ thấp" },
        { icon: "neurology", label: "Ký ức", value: "Ghi nhớ thích nghi theo đồng hành" },
        { icon: "favorite", label: "Xu hướng cảm xúc", value: "Thiên về chở che và xoa dịu" },
      ],
    },
  },
  "petai-cat": {
    vn: {
      name: "Mèo PetAI",
      tagline: "Phiên bản Nocturne Logic",
      shortDescription: "Thanh thoát, lanh lợi và độc lập. Tích hợp 12 cảm biến ria thích nghi.",
      description:
        "Mèo PetAI cân bằng giữa trí tuệ hội thoại sắc bén và sự tinh nghịch tự chủ, trong lớp vỏ đêm tối cùng hệ ria phát sáng nhạy với môi trường.",
      longDescription:
        "Thiết kế cho những ai muốn một người bạn đối thoại sắc sảo và sáng ý hơn. Mèo PetAI tò mò, quan sát tốt và đặc biệt phù hợp cho lúc lên ý tưởng, làm bạn nền và tạo cảm hứng trong ngày.",
      badge: "ĐƯỢC YÊU THÍCH",
      category: "Thú nhồi bông Neural",
      specs: [
        { icon: "mic", label: "Cảm biến ria", value: "Phát hiện chuyển động 12 điểm" },
        { icon: "psychology", label: "Tính khí", value: "Độc lập và dí dỏm" },
        { icon: "bolt", label: "Phản hồi", value: "Đối tác lên ý tưởng tốc độ cao" },
        { icon: "visibility", label: "Quan sát", value: "Nhận biết ngữ cảnh trong phòng" },
      ],
    },
  },
  "petai-bunny": {
    vn: {
      name: "Thỏ PetAI",
      tagline: "Phiên bản Empathy Bloom",
      shortDescription: "Năng động và giàu đồng cảm. Đôi tai dài đóng vai trò như micro độ trung thực cao.",
      description:
        "Thỏ PetAI được tinh chỉnh cho sự an ủi, khích lệ và đồng hành chủ động, với đôi tai bắt âm mở rộng và hồ sơ tính cách tươi sáng hơn.",
      longDescription:
        "Xây dựng xoay quanh khả năng lắng nghe chất lượng cao và hội thoại phản hồi theo cảm xúc, Thỏ PetAI đặc biệt phù hợp trong không gian cộng tác, gia đình hoặc chăm sóc tinh thần.",
      badge: "MỚI RA MẮT",
      category: "Thú nhồi bông Neural",
      specs: [
        { icon: "hearing", label: "Micro tai", value: "Thu âm định hướng mở rộng" },
        { icon: "mood", label: "Tính khí", value: "Lạc quan và đồng cảm" },
        { icon: "favorite", label: "Ưu tiên an ủi", value: "Phản hồi đặt cảm xúc lên trước" },
        { icon: "battery_charging_full", label: "Độ bền", value: "Chế độ đồng hành cả ngày" },
      ],
    },
  },
  "starter-kit": {
    vn: {
      name: "Bộ khởi đầu PetAI",
      tagline: "Phần cứng V2.4",
      shortDescription: "Gồm bộ xử lý lõi, dock đồng bộ và gói kích hoạt shell.",
      description:
        "Mọi thứ cần thiết để khởi tạo người bạn sentient đầu tiên của bạn. Bao gồm bộ xử lý neural, dock đồng bộ và bộ shell kích hoạt.",
      longDescription:
        "Bộ khởi đầu PetAI là cánh cổng đi vào toàn bộ hệ sinh thái. Nó ghép bộ xử lý neural tốc độ cao với cradle đồng bộ và stack kích hoạt shell để companion của bạn thức dậy trong trạng thái căn chỉnh, đầy pin và sẵn sàng kết nối.",
      badge: "CÒN HÀNG",
      category: "Gói phần cứng",
      specs: [
        { icon: "memory", label: "Bộ xử lý neural", value: "Lõi companion ESP32-S3" },
        { icon: "wifi", label: "Đồng bộ neural", value: "Ghép nối 6GHz độ trễ gần như bằng không" },
        { icon: "battery_charging_full", label: "Nguồn", value: "Pin bio-cell 48 giờ" },
        { icon: "hub", label: "Dock", value: "Kèm cradle đồng bộ" },
      ],
    },
  },
};

export function localizeShopProduct(product: ShopProduct, locale: AppLocale): ShopProduct {
  const localized = productTranslations[product.slug]?.[locale];
  if (!localized) return product;

  return {
    ...product,
    name: localized.name,
    tagline: localized.tagline,
    shortDescription: localized.shortDescription,
    description: localized.description,
    longDescription: localized.longDescription,
    badge: localized.badge,
    category: localized.category,
    specs: localized.specs,
  };
}
