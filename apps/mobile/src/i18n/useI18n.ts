import { localeStore, type AppLocale } from "@/store/localeStore";

const dictionary: Record<AppLocale, Record<string, string>> = {
  en: {
    Home: "Home",
    Shop: "Shop",
    Settings: "Settings",
    Account: "Account",
    "Claim Device": "Claim Device",
    "Pet Identity": "Pet Identity",
    "Voice Selection": "Voice Selection",
    Talk: "Talk",
    "Voice Chat": "Voice Chat",
    "Device Settings": "Device Settings",
    "Pet Profile": "Pet Profile",
    Pets: "Pets",
    "YOUR PETS": "YOUR PETS",
    "SYSTEM LOGS": "SYSTEM LOGS",
    "Your bonded companions are online and ready to connect.":
      "Your bonded companions are online and ready to connect.",
    "Syncing your companions…": "Syncing your companions…",
    "No pets are linked to this account yet.":
      "No pets are linked to this account yet.",
    "No system logs available yet.": "No system logs available yet.",
    "Claim a new PetAI device": "Claim a new PetAI device",
    "Sentient Login": "Sentient Login",
    "Access your companion network and continue the current bond.":
      "Access your companion network and continue the current bond.",
    Email: "Email",
    Password: "Password",
    "Unable to sign in right now.": "Unable to sign in right now.",
    "Sign In": "Sign In",
    "Need a PetAI account? Register now.":
      "Need a PetAI account? Register now.",
    "Welcome Back": "Welcome Back",
    "Sign in to continue your journey": "Sign in to continue your journey",
    "Email Address": "Email Address",
    "Forgot Password?": "Forgot Password?",
    "OR CONTINUE WITH": "OR CONTINUE WITH",
    "Don't have an account?": "Don't have an account?",
    RegisterNow: "Register",
    "Create Your Neural Profile": "Create Your Neural Profile",
    "Connect your biology to the intelligence of the future.":
      "Connect your biology to the intelligence of the future.",
    "System Initialized": "System Initialized",
    "IDENTITY NAME": "IDENTITY NAME",
    "NEURAL ADDRESS": "NEURAL ADDRESS",
    "ENCRYPTION KEY": "ENCRYPTION KEY",
    "I acknowledge the Neural Protocol Terms and the Privacy Infrastructure Agreement.":
      "I acknowledge the Neural Protocol Terms and the Privacy Infrastructure Agreement.",
    "Already have a link?": "Already have a link?",
    "EXISTING USER LOGIN": "EXISTING USER LOGIN",
    "Create Account": "Create Account",
    "Initialize your owner profile and unlock the PetAI ecosystem.":
      "Initialize your owner profile and unlock the PetAI ecosystem.",
    "Full Name": "Full Name",
    "Unable to create account right now.":
      "Unable to create account right now.",
    Register: "Register",
    "Already connected? Return to login.":
      "Already connected? Return to login.",
    "Manage your account, app preferences, and companion privacy settings.":
      "Manage your account, app preferences, and companion privacy settings.",
    "Loading account…": "Loading account…",
    ACCOUNT: "ACCOUNT",
    "PROFILE DETAILS": "PROFILE DETAILS",
    "CHANGE PASSWORD": "CHANGE PASSWORD",
    LANGUAGE: "LANGUAGE",
    "Display Name": "Display Name",
    "Save Profile": "Save Profile",
    "Saving...": "Saving...",
    "Current Password": "Current Password",
    "New Password": "New Password",
    "Confirm Password": "Confirm Password",
    "Change Password": "Change Password",
    Updating: "Updating",
    "Updating...": "Updating...",
    "App Language": "App Language",
    English: "English",
    Vietnamese: "Vietnamese",
    "Sign Out": "Sign Out",
    "Member Since": "Member Since",
    "Account Type": "Account Type",
    Security: "Security",
    "Password Protected": "Password Protected",
    "Profile updated.": "Profile updated.",
    "Unable to load your account.": "Unable to load your account.",
    "Unable to update your profile.": "Unable to update your profile.",
    "New password and confirmation do not match.":
      "New password and confirmation do not match.",
    "Password changed.": "Password changed.",
    "Unable to change password.": "Unable to change password.",
    "Keep your owner account secure with a fresh password.":
      "Keep your owner account secure with a fresh password.",
    "Update the display name shown across your PetAI experience.":
      "Update the display name shown across your PetAI experience.",
    "Choose the interface language used across the mobile app.":
      "Choose the interface language used across the mobile app.",
    "NEURAL COLLECTION": "NEURAL COLLECTION",
    "Shop companions without the clutter.": "Shop companions without the clutter.",
    "Browse the line, open a full product detail view, then move into a dedicated checkout screen when you are ready.":
      "Browse the line, open a full product detail view, then move into a dedicated checkout screen when you are ready.",
    "item selected": "item selected",
    "items selected": "items selected",
    Checkout: "Checkout",
    "Loading live shop inventory…": "Loading live shop inventory…",
    "Could not load shop data from the backend.": "Could not load shop data from the backend.",
    "FEATURED BUNDLE": "FEATURED BUNDLE",
    "View Details": "View Details",
    "Browse the collection": "Browse the collection",
    "Tap any product to see its full imagery, description, specs, and quantity controls.":
      "Tap any product to see its full imagery, description, specs, and quantity controls.",
    "in cart": "in cart",
    "Loading product details…": "Loading product details…",
    "QUANTITY": "QUANTITY",
    "already in cart": "already in cart",
    "SPECIFICATIONS": "SPECIFICATIONS",
    "ORDER CONFIRMED": "ORDER CONFIRMED",
    "Your order has been saved.": "Your order has been saved.",
    "Customer details and line items are now in the database, and the admin team can review them from the admin order page.":
      "Customer details and line items are now in the database, and the admin team can review them from the admin order page.",
    "Back to Shop": "Back to Shop",
    CHECKOUT: "CHECKOUT",
    "Customer & shipping details": "Customer & shipping details",
    "This checkout flow mirrors the website: review your bundle, enter shipping details, and submit one clean order record.":
      "This checkout flow mirrors the website: review your bundle, enter shipping details, and submit one clean order record.",
    "Order summary": "Order summary",
    "Customer information": "Customer information",
    "Email address": "Email address",
    "Phone number": "Phone number",
    "Company (optional)": "Company (optional)",
    "Shipping address": "Shipping address",
    "Street address": "Street address",
    "Apartment / suite (optional)": "Apartment / suite (optional)",
    City: "City",
    "State / Province": "State / Province",
    "Postal code": "Postal code",
    Country: "Country",
    "Order note (optional)": "Order note (optional)",
    "Submitting...": "Submitting...",
    "Place Order": "Place Order",
    "Please complete the required customer and shipping information.":
      "Please complete the required customer and shipping information.",
    "Your cart is empty.": "Your cart is empty.",
    "Product Details": "Product Details",
    Add: "Add",
    Details: "Details",
    "Could not load this product.": "Could not load this product.",
    "Product not found.": "Product not found.",
    "IN-APP MUSIC": "IN-APP MUSIC",
    "Ask PetAI to play, pause, or resume Apple Music inside the app.":
      "Ask PetAI to play, pause, or resume Apple Music inside the app.",
    "No music playing yet.": "No music playing yet.",
    "Now Playing": "Now Playing",
    Pause: "Pause",
    Resume: "Resume",
    "Music paused.": "Music paused.",
    "Music resumed.": "Music resumed.",
    "Music stopped.": "Music stopped.",
    "Tell PetAI what song, artist, or mood you want to hear.":
      "Tell PetAI what song, artist, or mood you want to hear.",
    "Couldn't find a matching song on Apple Music.":
      "Couldn't find a matching song on Apple Music.",
    "Apple Music permission is required for in-app playback.":
      "Apple Music permission is required for in-app playback.",
    "An active Apple Music subscription is required for in-app playback.":
      "An active Apple Music subscription is required for in-app playback.",
    "Apple Music playback is only available on iPhone builds.":
      "Apple Music playback is only available on iPhone builds.",
    "Apple Music playback requires iOS 15 or newer.":
      "Apple Music playback requires iOS 15 or newer.",
    "Could not control Apple Music right now.":
      "Could not control Apple Music right now.",
  },
  vn: {
    Home: "Trang chủ",
    Shop: "Cửa hàng",
    Settings: "Cài đặt",
    Account: "Tài khoản",
    "Claim Device": "Liên kết thiết bị",
    "Pet Identity": "Danh tính Pet",
    "Voice Selection": "Chọn giọng nói",
    Talk: "Chat chữ",
    "Voice Chat": "Chat giọng nói",
    "Device Settings": "Cài đặt thiết bị",
    "Pet Profile": "Hồ sơ pet",
    Pets: "Pets",
    "YOUR PETS": "DANH SÁCH PET",
    "SYSTEM LOGS": "NHẬT KÝ HỆ THỐNG",
    "Your bonded companions are online and ready to connect.":
      "Những người bạn đồng hành của bạn đã online và sẵn sàng kết nối.",
    "Syncing your companions…": "Đang đồng bộ các companion…",
    "No pets are linked to this account yet.":
      "Tài khoản này chưa liên kết pet nào.",
    "No system logs available yet.": "Chưa có log hệ thống nào.",
    "Claim a new PetAI device": "Liên kết thiết bị PetAI mới",
    "Sentient Login": "Đăng nhập",
    "Access your companion network and continue the current bond.":
      "Truy cập mạng lưới companion của bạn và tiếp tục kết nối hiện tại.",
    Email: "Email",
    Password: "Mật khẩu",
    "Unable to sign in right now.": "Hiện chưa thể đăng nhập.",
    "Sign In": "Đăng nhập",
    "Need a PetAI account? Register now.":
      "Chưa có tài khoản PetAI? Đăng ký ngay.",
    "Welcome Back": "Chào mừng trở lại",
    "Sign in to continue your journey": "Đăng nhập để tiếp tục hành trình của bạn",
    "Email Address": "Địa chỉ email",
    "Forgot Password?": "Quên mật khẩu?",
    "OR CONTINUE WITH": "HOẶC TIẾP TỤC VỚI",
    "Don't have an account?": "Chưa có tài khoản?",
    RegisterNow: "Đăng ký",
    "Create Your Neural Profile": "Tạo hồ sơ neural của bạn",
    "Connect your biology to the intelligence of the future.":
      "Kết nối bản thể của bạn với trí tuệ của tương lai.",
    "System Initialized": "Hệ thống đã khởi tạo",
    "IDENTITY NAME": "TÊN ĐỊNH DANH",
    "NEURAL ADDRESS": "ĐỊA CHỈ NEURAL",
    "ENCRYPTION KEY": "KHÓA MÃ HÓA",
    "I acknowledge the Neural Protocol Terms and the Privacy Infrastructure Agreement.":
      "Tôi đồng ý với Điều khoản Neural Protocol và Thỏa thuận Hạ tầng Quyền riêng tư.",
    "Already have a link?": "Đã có liên kết?",
    "EXISTING USER LOGIN": "ĐĂNG NHẬP NGƯỜI DÙNG HIỆN CÓ",
    "Create Account": "Tạo tài khoản",
    "Initialize your owner profile and unlock the PetAI ecosystem.":
      "Khởi tạo hồ sơ chủ sở hữu và mở khóa hệ sinh thái PetAI.",
    "Full Name": "Họ và tên",
    "Unable to create account right now.":
      "Hiện chưa thể tạo tài khoản.",
    Register: "Đăng ký",
    "Already connected? Return to login.":
      "Đã có tài khoản? Quay lại đăng nhập.",
    "Manage your account, app preferences, and companion privacy settings.":
      "Quản lý tài khoản, tuỳ chọn ứng dụng và quyền riêng tư của companion.",
    "Loading account…": "Đang tải tài khoản…",
    ACCOUNT: "TÀI KHOẢN",
    "PROFILE DETAILS": "THÔNG TIN HỒ SƠ",
    "CHANGE PASSWORD": "ĐỔI MẬT KHẨU",
    LANGUAGE: "NGÔN NGỮ",
    "Display Name": "Tên hiển thị",
    "Save Profile": "Lưu hồ sơ",
    "Saving...": "Đang lưu...",
    "Current Password": "Mật khẩu hiện tại",
    "New Password": "Mật khẩu mới",
    "Confirm Password": "Xác nhận mật khẩu",
    "Change Password": "Đổi mật khẩu",
    Updating: "Đang cập nhật",
    "Updating...": "Đang cập nhật...",
    "App Language": "Ngôn ngữ ứng dụng",
    English: "Tiếng Anh",
    Vietnamese: "Tiếng Việt",
    "Sign Out": "Đăng xuất",
    "Member Since": "Tham gia từ",
    "Account Type": "Loại tài khoản",
    Security: "Bảo mật",
    "Password Protected": "Đã bảo vệ bằng mật khẩu",
    "Profile updated.": "Đã cập nhật hồ sơ.",
    "Unable to load your account.": "Không thể tải tài khoản của bạn.",
    "Unable to update your profile.": "Không thể cập nhật hồ sơ.",
    "New password and confirmation do not match.":
      "Mật khẩu mới và xác nhận không khớp.",
    "Password changed.": "Đã đổi mật khẩu.",
    "Unable to change password.": "Không thể đổi mật khẩu.",
    "Keep your owner account secure with a fresh password.":
      "Giữ an toàn cho tài khoản chủ sở hữu bằng một mật khẩu mới.",
    "Update the display name shown across your PetAI experience.":
      "Cập nhật tên hiển thị trên toàn bộ trải nghiệm PetAI của bạn.",
    "Choose the interface language used across the mobile app.":
      "Chọn ngôn ngữ giao diện dùng trên ứng dụng mobile.",
    "NEURAL COLLECTION": "BỘ SƯU TẬP NEURAL",
    "Shop companions without the clutter.": "Mua companion với trải nghiệm gọn gàng hơn.",
    "Browse the line, open a full product detail view, then move into a dedicated checkout screen when you are ready.":
      "Xem toàn bộ dòng sản phẩm, mở màn chi tiết riêng, rồi chuyển sang checkout chuyên biệt khi bạn sẵn sàng.",
    "item selected": "sản phẩm đã chọn",
    "items selected": "sản phẩm đã chọn",
    Checkout: "Thanh toán",
    "Loading live shop inventory…": "Đang tải kho sản phẩm…",
    "Could not load shop data from the backend.": "Không thể tải dữ liệu shop từ backend.",
    "FEATURED BUNDLE": "GÓI NỔI BẬT",
    "View Details": "Xem chi tiết",
    "Browse the collection": "Xem bộ sưu tập",
    "Tap any product to see its full imagery, description, specs, and quantity controls.":
      "Chạm vào từng sản phẩm để xem ảnh, mô tả, thông số và điều chỉnh số lượng.",
    "in cart": "trong giỏ",
    "Loading product details…": "Đang tải chi tiết sản phẩm…",
    "QUANTITY": "SỐ LƯỢNG",
    "already in cart": "đã có trong giỏ",
    "SPECIFICATIONS": "THÔNG SỐ",
    "ORDER CONFIRMED": "ĐƠN HÀNG ĐÃ XÁC NHẬN",
    "Your order has been saved.": "Đơn hàng của bạn đã được lưu.",
    "Customer details and line items are now in the database, and the admin team can review them from the admin order page.":
      "Thông tin khách hàng và sản phẩm đã được lưu vào database, và admin có thể xem từ trang đơn hàng.",
    "Back to Shop": "Quay lại shop",
    CHECKOUT: "THANH TOÁN",
    "Customer & shipping details": "Thông tin khách hàng và giao hàng",
    "This checkout flow mirrors the website: review your bundle, enter shipping details, and submit one clean order record.":
      "Flow checkout này giống website: xem lại gói hàng, nhập thông tin giao hàng và gửi một bản ghi đơn hàng rõ ràng.",
    "Order summary": "Tóm tắt đơn hàng",
    "Customer information": "Thông tin khách hàng",
    "Email address": "Địa chỉ email",
    "Phone number": "Số điện thoại",
    "Company (optional)": "Công ty (tuỳ chọn)",
    "Shipping address": "Địa chỉ giao hàng",
    "Street address": "Địa chỉ",
    "Apartment / suite (optional)": "Căn hộ / số phòng (tuỳ chọn)",
    City: "Thành phố",
    "State / Province": "Tỉnh / Bang",
    "Postal code": "Mã bưu chính",
    Country: "Quốc gia",
    "Order note (optional)": "Ghi chú đơn hàng (tuỳ chọn)",
    "Submitting...": "Đang gửi...",
    "Place Order": "Đặt hàng",
    "Please complete the required customer and shipping information.":
      "Vui lòng điền đầy đủ thông tin khách hàng và giao hàng bắt buộc.",
    "Your cart is empty.": "Giỏ hàng của bạn đang trống.",
    "Product Details": "Chi tiết sản phẩm",
    Add: "Thêm",
    Details: "Chi tiết",
    "Could not load this product.": "Không thể tải sản phẩm này.",
    "Product not found.": "Không tìm thấy sản phẩm.",
    "IN-APP MUSIC": "NHẠC TRONG ỨNG DỤNG",
    "Ask PetAI to play, pause, or resume Apple Music inside the app.":
      "Hãy bảo PetAI phát, tạm dừng hoặc tiếp tục Apple Music ngay trong ứng dụng.",
    "No music playing yet.": "Chưa có bài nhạc nào đang phát.",
    "Now Playing": "Đang phát",
    Pause: "Tạm dừng",
    Resume: "Tiếp tục",
    "Music paused.": "Đã tạm dừng nhạc.",
    "Music resumed.": "Đã tiếp tục phát nhạc.",
    "Music stopped.": "Đã dừng phát nhạc.",
    "Tell PetAI what song, artist, or mood you want to hear.":
      "Hãy nói cho PetAI biết bài hát, nghệ sĩ hoặc mood bạn muốn nghe.",
    "Couldn't find a matching song on Apple Music.":
      "Không tìm thấy bài hát phù hợp trên Apple Music.",
    "Apple Music permission is required for in-app playback.":
      "Cần cấp quyền Apple Music để phát nhạc trong ứng dụng.",
    "An active Apple Music subscription is required for in-app playback.":
      "Cần có thuê bao Apple Music đang hoạt động để phát nhạc trong ứng dụng.",
    "Apple Music playback is only available on iPhone builds.":
      "Phát Apple Music chỉ khả dụng trên bản build iPhone.",
    "Apple Music playback requires iOS 15 or newer.":
      "Phát Apple Music yêu cầu iOS 15 trở lên.",
    "Could not control Apple Music right now.":
      "Hiện chưa thể điều khiển Apple Music.",
  },
};

export function useI18n() {
  const locale = localeStore((state) => state.locale);
  const setLocale = localeStore((state) => state.setLocale);

  function t(key: string) {
    return dictionary[locale][key] ?? key;
  }

  return { locale, setLocale, t };
}
