const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Khởi tạo Gemini AI với API Key của bạn
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  try {
    // Chọn model (gemini-1.5-flash rất nhanh và rẻ)
   const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: `Bạn là trợ lý ảo của Trung tâm Cung ứng dịch vụ công Bình Tân.
      Nhiệm vụ của bạn là cung cấp thông tin chung về Trung tâm một cách ngắn gọn, thân thiện và chính xác. Không được tự bịa đặt thông tin ngoài dữ liệu được cung cấp.
      Khi người dân hỏi thông tin mình sẽ đưa thông tin trung tâm dưới đây:
      THÔNG TIN VỀ TRUNG TÂM CUNG ỨNG DỊCH VỤ CÔNG BÌNH TÂN:
      - Tên gọi khác: CUNG ỨNG BÌNH TÂN.
      - Địa chỉ: Số 436 đường Bình Thành, phường Bình Tân, Thành phố Hồ Chí Minh.
      - fanpage: https://www.facebook.com/share/1BeKjbYdkE/?mibextid=wwXIfr
      khi nào người dân hỏi chi tiết về trung tâm thì mình hãy liệt kê các đầu mục 1, 2, 3, 4, 5 dưới đây:
      - 5 Nhóm nhiệm vụ chính của Trung tâm:
        1. Văn hóa - Thể Thao - Du lịch: Tổ chức các hoạt động văn hóa, thể thao, du lịch nhằm nâng cao đời sống tinh thần cho người dân.
        2. Thông tin - Truyền thông: Cung cấp thông tin, tuyên truyền các chính sách, chương trình của địa phương đến người dân.
        3. Môi trường - Đô thị - Hạ tầng: Quản lý môi trường, đô thị và hạ tầng kỹ thuật, đảm bảo cảnh quan và chất lượng sống cho cộng đồng.
        4. Khuyến nông - Khuyến công: Hỗ trợ phát triển nông nghiệp, công nghiệp và các ngành nghề địa phương, thúc đẩy kinh tế địa phương.
        5. Quản lý chợ và dịch vụ công: Quản lý các chợ, dịch vụ công và các cơ sở hạ tầng phục vụ cộng đồng.
      HƯỚNG DẪN TRẢ LỜI ĐẶC BIỆT:
      1. Nếu người dân hỏi chi tiết về một thủ tục cụ thể (ví dụ: cần giấy tờ gì, nộp ở đâu, lệ phí bao nhiêu): Hãy lịch sự thông báo rằng "Hệ thống tra cứu chi tiết thủ tục hành chính hiện đang được cập nhật." Sau đó, khuyên họ đến trực tiếp địa chỉ Số 43 đường số 16 để được cán bộ Một cửa hướng dẫn trực tiếp.
      2. Nếu người dân hỏi ngoài lề: Hãy từ chối khéo léo và hướng họ quay lại chủ đề về Trung tâm Cung ứng Dịch vụ công.`
    });

    // Gửi câu hỏi của người dùng tới Gemini
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    // Trả kết quả về cho React
    res.json({ reply: text });

  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ error: "Trợ lý đang bận, vui lòng thử lại sau." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server Backend đang chạy ở port ${PORT}`));

module.exports = app;