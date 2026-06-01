import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AppLocale = "vn" | "en";

const STORAGE_KEY = "petai.locale";

const dictionary: Record<AppLocale, Record<string, string>> = {
  vn: {
    Features: "Tính năng",
    Timeline: "Lộ trình",
    Personalities: "Tính cách",
    FAQ: "FAQ",
    Shop: "Cửa hàng",
    Dashboard: "Bảng điều khiển",
    Logout: "Đăng xuất",
    Login: "Đăng nhập",
    "Adopt PetAI": "Nhận nuôi PetAI",
    Overview: "Tổng quan",
    "My Pets": "Thú cưng của tôi",
    "Claim Device": "Liên kết thiết bị",
    Account: "Tài khoản",
    Products: "Sản phẩm",
    Devices: "Thiết bị",
    Pets: "Thú cưng",
    Users: "Người dùng",
    Voices: "Giọng nói",
    "PetAI Dashboard": "Bảng điều khiển PetAI",
    "Search systems...": "Tìm hệ thống...",
    "System Status": "Trạng thái hệ thống",
    Connected: "Đã kết nối",
    ONLINE: "TRỰC TUYẾN",
    "Choose your AI companion.": "Chọn người bạn AI của bạn.",
    "Pick a PetAI device, customize its personality, and bring it to life with our neural core technology.":
      "Chọn một thiết bị PetAI, tùy biến tính cách của nó và đưa nó vào cuộc sống với công nghệ neural core của chúng tôi.",
    "Shop Collection": "Xem bộ sưu tập",
    "Watch Launch Film": "Xem video ra mắt",
    "Neural Plush Line": "Dòng Neural Plush",
    "Hand-crafted synthetic fibers embedded with touch-sensitive neural arrays.":
      "Sợi tổng hợp chế tác thủ công, tích hợp mảng neural cảm ứng chạm.",
    "AI Integrated": "Tích hợp AI",
    "The Essential Experience": "Trải nghiệm cốt lõi",
    "Configure Bundle": "Cấu hình gói",
    Cart: "Giỏ hàng",
    Review: "Xem lại",
    "Add to Cart": "Thêm vào giỏ",
    "Buy Now": "Mua ngay",
    "Your Neural Core": "Lõi Neural của bạn",
    "items in cart": "sản phẩm trong giỏ",
    Shipping: "Vận chuyển",
    Payment: "Thanh toán",
    "Your cart is empty": "Giỏ hàng đang trống",
    Subtotal: "Tạm tính",
    "Continue to Checkout": "Tiếp tục thanh toán",
    "Please complete the customer and shipping information.":
      "Vui lòng hoàn tất thông tin khách hàng và giao hàng.",
    "Unable to place your order right now.":
      "Hiện chưa thể đặt đơn hàng của bạn.",
    "Keep Browsing": "Tiếp tục mua sắm",
    "Choose a neural companion or starter kit to begin building your bundle.":
      "Chọn một neural companion hoặc starter kit để bắt đầu xây dựng bundle của bạn.",
    CUSTOMER: "KHÁCH HÀNG",
    SHIPPING: "GIAO HÀNG",
    "CUSTOMER SUMMARY": "TÓM TẮT KHÁCH HÀNG",
    "Full name": "Họ và tên",
    "Phone number": "Số điện thoại",
    "Company (optional)": "Công ty (tuỳ chọn)",
    "Street address": "Địa chỉ",
    "Apartment, suite, building (optional)": "Căn hộ, số phòng, toà nhà (tuỳ chọn)",
    City: "Thành phố",
    "State / Province": "Tỉnh / Bang",
    "Postal code": "Mã bưu chính",
    Country: "Quốc gia",
    "Order note (optional)": "Ghi chú đơn hàng (tuỳ chọn)",
    Note: "Ghi chú",
    "ORDER RECEIVED": "ĐÃ NHẬN ĐƠN HÀNG",
    "Thanks, your order is in the queue.":
      "Cảm ơn bạn, đơn hàng của bạn đã vào hàng chờ xử lý.",
    "We saved your order details and the admin team can now review it. Reference number:":
      "Chúng tôi đã lưu thông tin đơn hàng và đội ngũ admin có thể xem ngay bây giờ. Mã tham chiếu:",
    "Review Order": "Xem lại đơn hàng",
    "Submitting...": "Đang gửi...",
    "Place Order": "Đặt hàng",
    Close: "Đóng",
    "Add to Neural Hub": "Thêm vào Neural Hub",
    View: "Xem",
    "Products Management": "Quản lý sản phẩm",
    "Add Product": "Thêm sản phẩm",
    "Edit Product": "Sửa sản phẩm",
    "Save Product": "Lưu sản phẩm",
    "Save Changes": "Lưu thay đổi",
    Cancel: "Hủy",
    Delete: "Xóa",
    Edit: "Sửa",
    PRICE: "GIÁ",
    "PRICE (USD)": "GIÁ (VND)",
    "Welcome back": "Chào mừng trở lại",
    "Create your PetAI account": "Tạo tài khoản PetAI",
    "Start your journey with an AI companion that grows with you.": "Bắt đầu hành trình với người bạn AI cùng bạn phát triển.",
    "Log in to manage your AI pet companion.": "Đăng nhập để quản lý thú cưng AI của bạn.",
    Register: "Đăng ký",
    "Logging in...": "Đang đăng nhập...",
    "Creating Account...": "Đang tạo tài khoản...",
    "Create Account": "Tạo tài khoản",
    "Already have an account?": "Đã có tài khoản?",
    "Use `admin@petai.io` to enter admin mode.": "Dùng `admin@petai.io` để vào chế độ quản trị.",
    "Neural Specifications": "Thông số Neural",
    "Pre-Order Now": "Đặt trước ngay",
    "2-Year Warranty": "Bảo hành 2 năm",
    "Free Express Shipping": "Miễn phí giao hàng nhanh",
    "System Overview": "Tổng quan hệ thống",
    "Recent Activity": "Hoạt động gần đây",
    "Expand Your Pet Ecosystem": "Mở rộng hệ sinh thái Pet của bạn",
    "New Hardware Detected": "Đã phát hiện phần cứng mới",
    "Serial Number": "Số serial",
    "Product Code": "Mã sản phẩm",
    "Secure Protocol": "Giao thức bảo mật",
    "Instant Pairing": "Ghép nối tức thì",
    "My Sentient Pets": "Thú cưng Sentient của tôi",
    Ecosystem: "Hệ sinh thái",
    "Companion Nodes": "Nút đồng hành",
    "Claim New Device": "Liên kết thiết bị mới",
    "Manage Pet": "Quản lý pet",
    "No pets yet": "Chưa có pet nào",
    "Pet Identity": "Danh tính Pet",
    "Voice Profile": "Hồ sơ giọng nói",
    "Save Identity": "Lưu danh tính",
    "Voice Activity": "Hoạt động giọng nói",
    "System Sync: Active": "Đồng bộ hệ thống: Đang hoạt động",
    "Upload Pet Image": "Tải ảnh pet",
    "Profile Details": "Thông tin hồ sơ",
    "Save Profile": "Lưu hồ sơ",
    "Change Password": "Đổi mật khẩu",
    "Current Password": "Mật khẩu hiện tại",
    "New Password": "Mật khẩu mới",
    "Confirm Password": "Xác nhận mật khẩu",
    "Upload Profile Image": "Tải ảnh đại diện",
    "Dashboard Overview": "Tổng quan dashboard",
    "System Health": "Sức khỏe hệ thống",
    "Last 7 Days": "7 ngày qua",
    "Last 30 Days": "30 ngày qua",
    "Loading data": "Đang tải dữ liệu",
    "No data": "Không có dữ liệu",
    "Add Pet": "Thêm pet",
    "Edit Pet": "Sửa pet",
    "Save Pet": "Lưu pet",
    "Add Device": "Thêm thiết bị",
    "Edit Device": "Sửa thiết bị",
    "Save Device": "Lưu thiết bị",
    "Pet Details": "Chi tiết pet",
    OWNER: "CHỦ SỞ HỮU",
    VOICE: "GIỌNG NÓI",
    DEVICE: "THIẾT BỊ",
    ACTIONS: "THAO TÁC",
    STATUS: "TRẠNG THÁI",
    "CLAIMED BY": "ĐƯỢC NHẬN BỞI",
    "PROVISIONED PET": "PET ĐÃ CẤP PHÁT",
    Active: "Đang hoạt động",
    Standby: "Chờ",
    Voice: "Giọng",
    "Loading dashboard": "Đang tải dashboard",
    "Could not load dashboard": "Không thể tải dashboard",
    "Loading your connected dashboard data.": "Đang tải dữ liệu dashboard đã kết nối.",
    "Unable to load dashboard.": "Không thể tải dashboard.",
    "VOICE ACTIVE": "GIỌNG ĐANG HOẠT ĐỘNG",
    "Claiming Device...": "Đang liên kết thiết bị...",
    "Unable to claim device.": "Không thể liên kết thiết bị.",
    "Loading pets": "Đang tải pet",
    "Could not load pets": "Không thể tải pet",
    "Loading your connected pets from the API.": "Đang tải pet đã kết nối từ API.",
    "Unable to load pets.": "Không thể tải danh sách pet.",
    "Claim a device and create your first pet profile to populate this view.": "Hãy liên kết thiết bị và tạo pet đầu tiên để hiển thị dữ liệu.",
    "Loading settings": "Đang tải cài đặt",
    "Could not load settings": "Không thể tải cài đặt",
    "No pet selected": "Chưa chọn pet",
    "Loading your pet profile.": "Đang tải hồ sơ pet.",
    "Create a pet profile first to manage identity settings here.": "Tạo hồ sơ pet trước để quản lý tại đây.",
    "Unable to load pet settings.": "Không thể tải cài đặt pet.",
    "Pet identity updated.": "Đã cập nhật danh tính pet.",
    "Unable to save pet settings.": "Không thể lưu cài đặt pet.",
    "Pet image uploaded.": "Đã tải ảnh pet lên.",
    "Unable to upload pet image.": "Không thể tải ảnh pet lên.",
    "Uploading...": "Đang tải lên...",
    "Saving...": "Đang lưu...",
    "Loading account": "Đang tải tài khoản",
    "Could not update account": "Không thể cập nhật tài khoản",
    Saved: "Đã lưu",
    "Loading your account profile.": "Đang tải hồ sơ tài khoản.",
    "Unable to load your account.": "Không thể tải tài khoản.",
    "Profile updated.": "Đã cập nhật hồ sơ.",
    "Unable to update your profile.": "Không thể cập nhật hồ sơ.",
    "New password and confirmation do not match.": "Mật khẩu mới và xác nhận không khớp.",
    "Password changed.": "Đã đổi mật khẩu.",
    "Unable to change password.": "Không thể đổi mật khẩu.",
    "Profile image uploaded.": "Đã tải ảnh đại diện lên.",
    "Unable to upload profile image.": "Không thể tải ảnh đại diện lên.",
    Updating: "Đang cập nhật...",
    "Unable to load admin dashboard.": "Không thể tải dashboard admin.",
    "SYSTEM: ONLINE": "HỆ THỐNG: TRỰC TUYẾN",
    "Loading platform metrics and activity.": "Đang tải chỉ số nền tảng và hoạt động.",
    "Could not load admin dashboard": "Không thể tải dashboard admin",
    "Unable to load devices.": "Không thể tải thiết bị.",
    "Unable to load users.": "Không thể tải người dùng.",
    "Unable to load voices.": "Không thể tải giọng nói.",
    "Could not load table": "Không thể tải bảng",
    "No records were returned by the backend yet.": "Backend chưa trả về bản ghi nào.",
    Details: "Chi tiết",
    Missing: "Thiếu",
    None: "Không có",
    Unassigned: "Chưa gán",
    Add: "Thêm",
    "PetAI User": "Người dùng PetAI",
    "Next-Gen Sentient Tech": "Công nghệ cảm xúc thế hệ mới",
    "Your AI companion that": "Người bạn AI của bạn",
    "truly feels alive.": "thật sự sống động.",
    "A real AI-powered pet that listens, talks, remembers, and grows with you. Experience emotional intelligence in physical form.":
      "Một thú cưng AI thực thụ biết lắng nghe, trò chuyện, ghi nhớ và lớn lên cùng bạn. Trải nghiệm trí tuệ cảm xúc trong hình hài vật lý.",
    "Get Started": "Bắt đầu",
    "Watch Demo": "Xem demo",
    "Mood Status": "Trạng thái cảm xúc",
    "Joyful & Curious": "Vui vẻ & Tò mò",
    "ALIVE VOICE ANALYSIS": "PHÂN TÍCH GIỌNG NÓI SỐNG",
    "Unparalleled Intelligence": "Trí tuệ vượt trội",
    "Built on the most advanced neural architecture for companionship.":
      "Được xây dựng trên kiến trúc neural tiên tiến nhất cho sự đồng hành.",
    "Real-time Voice": "Giọng nói thời gian thực",
    "Natural, zero-latency conversation that feels exactly like talking to a friend.":
      "Trò chuyện tự nhiên, gần như không độ trễ, cảm giác như nói chuyện với một người bạn.",
    "Personalized Identity": "Danh tính cá nhân hóa",
    "Your pet develops its own unique personality based on your interactions.":
      "Pet phát triển tính cách độc nhất dựa trên tương tác của bạn.",
    "Emotional Memory": "Trí nhớ cảm xúc",
    "PetAI remembers your favorite things, your moods, and shared stories.":
      "PetAI ghi nhớ sở thích, cảm xúc và những câu chuyện bạn chia sẻ.",
    "Custom Voices": "Giọng nói tùy chỉnh",
    "Choose from a library of professional voices or create a custom one.":
      "Chọn từ thư viện giọng nói chuyên nghiệp hoặc tự tạo giọng riêng.",
    "Wake Word": "Từ đánh thức",
    "Customizable wake words so your PetAI responds to any name you give it.":
      "Tùy chỉnh từ đánh thức để PetAI phản hồi theo tên bạn đặt.",
    "Monitor health, change settings, and see memories on the go.":
      "Theo dõi tình trạng, đổi cài đặt và xem ký ức mọi lúc mọi nơi.",
    "Smart AI": "AI thông minh",
    "Equipped with the latest GPT-4o architecture for infinite knowledge.":
      "Trang bị kiến trúc GPT-4o mới nhất cho tri thức gần như vô hạn.",
    "Connected Hub": "Hub kết nối",
    "The physical hardware features a tactile touch-sensitive body.":
      "Phần cứng vật lý có bề mặt cảm ứng chạm nhạy.",
    "Start Your Journey": "Bắt đầu hành trình",
    "Three simple steps to the future of companionship.":
      "Ba bước đơn giản để đến với tương lai đồng hành.",
    "Claim your PetAI": "Nhận PetAI của bạn",
    "Reserve your hardware unit and choose your base physical model colors.":
      "Đặt trước thiết bị và chọn màu cho mẫu vật lý cơ bản.",
    "Customize identity": "Tùy biến danh tính",
    "Shape their core traits through the app—from hyper-active to calm and wise.":
      "Định hình tính cách cốt lõi qua app, từ năng động đến điềm tĩnh và sâu sắc.",
    "Start talking": "Bắt đầu trò chuyện",
    "Introduce yourself and watch as your PetAI begins its unique growth phase.":
      "Giới thiệu bản thân và theo dõi PetAI bước vào giai đoạn phát triển riêng.",
    "The Voices of Soul": "Những giọng nói của tâm hồn",
    "Hear the diverse personalities of our AI models.":
      "Lắng nghe các tính cách đa dạng từ những mô hình AI của chúng tôi.",
    Shimmer: "Shimmer",
    "GENTLE & NURTURING": "DỊU DÀNG & CHĂM SÓC",
    "\"I'm here to listen, support, and grow alongside you every single day.\"":
      "\"Tôi ở đây để lắng nghe, đồng hành và cùng bạn trưởng thành mỗi ngày.\"",
    Nova: "Nova",
    "WITTY & ENERGETIC": "HÓM HỈNH & NĂNG LƯỢNG",
    "\"Ready for an adventure? Let's explore the world of ideas together!\"":
      "\"Sẵn sàng cho chuyến phiêu lưu chưa? Cùng khám phá thế giới ý tưởng nhé!\"",
    Alloy: "Alloy",
    "CALM & REFLECTIVE": "ĐIỀM TĨNH & SÂU LẮNG",
    "\"Let's take a deep breath. I have some interesting insights for you.\"":
      "\"Hãy hít thở sâu nào. Tôi có vài góc nhìn thú vị cho bạn.\"",
    Selected: "Đã chọn",
    "Hear Sample": "Nghe thử",
    "THE CORE PHILOSOPHY": "TRIẾT LÝ CỐT LÕI",
    "More than a toy.": "Không chỉ là món đồ chơi.",
    "A companion.": "Mà là một người bạn đồng hành.",
    "PetAI isn't programmed to entertain you; it's designed to understand you. Using advanced emotional sentiment analysis, it senses your mood through your voice and responds with genuine empathy.":
      "PetAI không được lập trình chỉ để giải trí; nó được tạo ra để thấu hiểu bạn. Nhờ phân tích cảm xúc nâng cao, PetAI cảm nhận tâm trạng qua giọng nói và phản hồi bằng sự đồng cảm chân thành.",
    "COMPANION APP": "ỨNG DỤNG ĐỒNG HÀNH",
    "The Command Center": "Trung tâm điều khiển",
    "Deep Insights Dashboard": "Bảng điều khiển chuyên sâu",
    "Visualize your pet's development, emotional trends, and conversational milestones.":
      "Trực quan hóa tiến trình phát triển, xu hướng cảm xúc và các cột mốc hội thoại của pet.",
    "Shared Memories": "Ký ức chung",
    "Review all the special moments and knowledge your pet has acquired during your time together.":
      "Xem lại những khoảnh khắc đặc biệt và tri thức pet tích lũy cùng bạn.",
    "Neural Tuner": "Bộ tinh chỉnh Neural",
    "Fine-tune the balance of humor, empathy, and creativity in your pet's personality matrix.":
      "Tinh chỉnh cân bằng giữa hài hước, đồng cảm và sáng tạo trong ma trận tính cách của pet.",
    "Curious Minds": "Góc giải đáp",
    "Common questions about the PetAI experience.":
      "Những câu hỏi phổ biến về trải nghiệm PetAI.",
    "What is PetAI?": "PetAI là gì?",
    "PetAI is the world's first emotionally intelligent physical companion. It combines advanced AI language models with custom hardware to create a pet that truly interacts with its environment and owner.":
      "PetAI là người bạn đồng hành vật lý có trí tuệ cảm xúc đầu tiên trên thế giới. PetAI kết hợp mô hình ngôn ngữ AI tiên tiến với phần cứng tùy biến để tạo ra một thú cưng tương tác thật sự với môi trường và chủ nhân.",
    "Does it work offline?": "PetAI có hoạt động offline không?",
    "While basic interactions and emotional responses are handled on-device, complex conversations and knowledge queries require a Wi-Fi connection to access our neural cloud.":
      "Các tương tác cơ bản và phản hồi cảm xúc được xử lý trên thiết bị, nhưng hội thoại phức tạp và truy vấn tri thức cần kết nối Wi-Fi để truy cập neural cloud.",
    "Is my privacy protected?": "Quyền riêng tư của tôi có được bảo vệ không?",
    "Absolutely. All data is end-to-end encrypted. We never sell your personal conversations, and you can wipe your pet's memory at any time from the app settings.":
      "Chắc chắn có. Tất cả dữ liệu đều được mã hóa đầu-cuối. Chúng tôi không bao giờ bán hội thoại cá nhân của bạn, và bạn có thể xóa bộ nhớ của pet bất kỳ lúc nào trong cài đặt ứng dụng.",
    "What age is PetAI suitable for?": "PetAI phù hợp với độ tuổi nào?",
    "PetAI is designed for everyone from children with parental controls to elderly companions seeking a warm presence in the home.":
      "PetAI được thiết kế cho mọi người, từ trẻ em có kiểm soát phụ huynh đến người lớn tuổi cần một sự hiện diện ấm áp trong nhà.",
    "How long is the battery life?": "Pin dùng được bao lâu?",
    "PetAI lasts up to 12 hours of continuous interaction on a single charge and features a beautiful wireless charging nest for when it needs to \"sleep.\"":
      "PetAI hoạt động liên tục đến 12 giờ cho mỗi lần sạc và đi kèm đế sạc không dây đẹp mắt cho lúc cần \"ngủ\".",
    "Bring your AI pet to life.": "Mang AI pet của bạn vào cuộc sống.",
    "Limited first batch shipping this November. Secure your position in the future of companionship.":
      "Lô hàng đầu tiên số lượng giới hạn sẽ giao vào tháng 11. Giữ chỗ của bạn trong tương lai đồng hành ngay hôm nay.",
    "Adopt Now — $299": "Nhận nuôi ngay — $299",
    "Learn More": "Tìm hiểu thêm",
    "30-day happiness guarantee": "Cam kết hài lòng 30 ngày",
    "Engineered with soul. Redefining what it means to be alive in the digital age.":
      "Được kiến tạo bằng cảm xúc. Định nghĩa lại ý nghĩa của sự sống trong thời đại số.",
    Company: "Công ty",
    "Our Vision": "Tầm nhìn",
    "Lab Reports": "Báo cáo phòng lab",
    "Safety Ethics": "Đạo đức an toàn",
    Contact: "Liên hệ",
    Support: "Hỗ trợ",
    "Discord Community": "Cộng đồng Discord",
    "Support Center": "Trung tâm hỗ trợ",
    "Quick Start Guide": "Hướng dẫn nhanh",
    "Privacy Policy": "Chính sách riêng tư",
    Newsletter: "Bản tin",
    "Stay updated with our latest neural features.":
      "Cập nhật những tính năng neural mới nhất.",
    "Email address": "Địa chỉ email",
    "© 2024 PetAI. Engineered with soul. All rights reserved.":
      "© 2024 PetAI. Được kiến tạo bằng cảm xúc. Bảo lưu mọi quyền.",
  },
  en: {},
};

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function initialLocale(): AppLocale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "vn" || stored === "en") return stored;
  return "vn";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  function setLocale(next: AppLocale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => dictionary[locale][key] ?? key,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return value;
}
