"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { hotelService } from '@/services/hotelService';
import { Rate, Tag, Button, Spin, Empty, Row, Col, Divider, Typography, Space, DatePicker } from 'antd';
import { 
  EnvironmentOutlined, WifiOutlined, CoffeeOutlined, 
  CarOutlined, ArrowLeftOutlined, 
  CheckCircleFilled, CalendarOutlined, UserOutlined,
  CloseOutlined, CheckOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Ảnh mẫu đa dạng - chọn theo index để không hardcode tên phòng
const roomImagePool = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=400',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=400',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400',
];
const getRoomImage = (index: number) => roomImagePool[index % roomImagePool.length];

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<any>(null);

  const fetchDetail = async (dates?: any) => {
    try {
      setLoading(true);
      let checkIn = "";
      let checkOut = "";
      
      if (dates && dates[0] && dates[1]) {
        checkIn = dates[0].format('YYYY-MM-DD');
        checkOut = dates[1].format('YYYY-MM-DD');
      }

      const res = await hotelService.getHotelById(id as string, checkIn, checkOut);
      setData(res);
    } catch (error) {
      console.error("Lỗi lấy chi tiết khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleDateChange = (dates: any) => {
    setSelectedDates(dates);
    fetchDetail(dates);
  };

  const handleSelectRoomType = (roomType: any) => {
    if (!selectedDates) {
      return alert("Vui lòng chọn ngày nhận và trả phòng trước để đặt chỗ!");
    }
    if (roomType.availableRooms <= 0) return;

    const checkIn = selectedDates[0].format('YYYY-MM-DD');
    const checkOut = selectedDates[1].format('YYYY-MM-DD');
    router.push(`/booking?hotelId=${data.hotel.id}&roomTypeId=${roomType.id}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  if (loading && !data) return (
    <div className="h-screen flex items-center justify-center bg-[#f9f7f2]">
      <Spin size="large" description="Đang tải..." />
    </div>
  );
  if (!data) return <Empty description="Không tìm thấy khách sạn" />;

  const hotel = data.hotel;
  const roomTypes = data.roomTypes || [];



  return (
    <div className="min-h-screen bg-[#f9f7f2] pb-20">
      {/* HEADER: NÚT QUAY LẠI */}
      <div className="container mx-auto px-4 pt-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="hover:text-[#f97316] font-bold text-xs uppercase tracking-widest mb-4 flex items-center"
        >
          Quay lại
        </Button>
      </div>

      {/* GALLERY ẢNH */}
      <div className="container mx-auto px-4 mb-10">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden shadow-lg">
          <div className="col-span-2 row-span-2 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 3" />
          </div>
          <div className="col-span-1 row-span-1 bg-black/80 flex items-center justify-center text-white cursor-pointer hover:bg-black/90 transition-colors">
            <div className="text-center">
              <span className="block text-xl font-bold">+5</span>
              <span className="text-[9px] uppercase tracking-widest">Xem thêm</span>
            </div>
          </div>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="container mx-auto px-4">
        <Row gutter={[32, 32]}>
          {/* LEFT: HOTEL INFO + ROOM TYPES */}
          <Col xs={24} lg={16}>
            {/* HOTEL HEADER */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <Title level={2} className="!text-2xl !font-bold !mb-1 !text-gray-900">
                    {hotel.name}
                  </Title>
                  <Text className="text-gray-500 flex items-center gap-1.5 text-sm">
                    <EnvironmentOutlined className="text-[#f97316]" /> {hotel.address}, {hotel.city}
                  </Text>
                  <div className="flex items-center gap-3 mt-3">
                    <Rate disabled value={hotel.starRating} style={{ fontSize: 14 }} />
                    <Tag color="orange" className="!rounded-full !text-[10px] !font-semibold !px-3 !border-none">
                      {hotel.starRating} Sao
                    </Tag>
                  </div>
                </div>
              </div>

              <Divider className="!my-4" />

              {/* MÔ TẢ */}
              <Text className="text-gray-500 leading-relaxed text-sm block">
                {hotel.description}
              </Text>

              {/* TIỆN NGHI */}
              <div className="flex flex-wrap gap-6 mt-5">
                <Space size={6}><WifiOutlined className="text-[#f97316]" /> <Text className="text-gray-600 text-sm">WiFi Free</Text></Space>
                <Space size={6}><CoffeeOutlined className="text-[#f97316]" /> <Text className="text-gray-600 text-sm">Ăn sáng</Text></Space>
                <Space size={6}><CarOutlined className="text-[#f97316]" /> <Text className="text-gray-600 text-sm">Đỗ xe</Text></Space>
              </div>
            </div>

            {/* BỘ CHỌN NGÀY */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <Title level={5} className="!text-sm !font-bold !mb-3 !text-gray-700">
                <CalendarOutlined className="mr-2 text-[#f97316]" /> Chọn ngày đặt phòng
              </Title>
              <DatePicker.RangePicker 
                className="w-full !h-12 !rounded-xl"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                onChange={handleDateChange}
                placeholder={['Nhận phòng', 'Trả phòng']}
                format="DD/MM/YYYY"
              />
              {!selectedDates && (
                <Text className="text-[11px] text-gray-400 mt-2 block italic">
                  * Chọn ngày để xem giá và tình trạng phòng chính xác
                </Text>
              )}
            </div>

            {/* DANH SÁCH LOẠI PHÒNG - TRAVELOKA STYLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <Title level={4} className="!text-base !font-bold !mb-0 !text-gray-800">
                  Chọn loại phòng
                </Title>
                <Text className="text-xs text-gray-400 mt-1 block">
                  {selectedDates 
                    ? `Nhận: ${selectedDates[0].format('DD/MM/YYYY')} • Trả: ${selectedDates[1].format('DD/MM/YYYY')}`
                    : 'Vui lòng chọn ngày trước khi đặt'}
                </Text>
              </div>

              {/* Traveloka-style Horizontal Cards */}
              <div className="divide-y divide-gray-50">
                {roomTypes.map((rt: any, index: number) => (
                  <div 
                    key={rt.id} 
                    className={`flex flex-col md:flex-row items-stretch p-4 hover:bg-orange-50/20 transition-colors ${
                      rt.availableRooms <= 0 ? 'opacity-50' : ''
                    }`}
                  >
                    {/* LEFT: Image */}
                    <div className="flex-shrink-0 md:w-[160px] mb-3 md:mb-0">
                      <img 
                        src={getRoomImage(index)} 
                        alt={rt.name}
                        className="w-full h-28 md:h-full min-h-[100px] rounded-xl object-cover shadow-sm"
                      />
                    </div>

                    {/* MIDDLE: Content */}
                    <div className="flex-1 md:px-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Text strong className="text-base text-gray-800 block leading-tight">{rt.name}</Text>
                          {/* Capacity */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {Array.from({ length: rt.capacity }).map((_: any, i: number) => (
                              <UserOutlined key={i} className="text-gray-300 text-xs" />
                            ))}
                            <Text className="text-[10px] text-gray-400 ml-1">tối đa {rt.capacity}</Text>
                          </div>
                        </div>
                        <Text className="text-[11px] text-gray-400 block mt-1 leading-relaxed line-clamp-2">
                          {rt.description}
                        </Text>
                      </div>

                      {/* Policies */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-1">
                          {rt.breakfastIncluded 
                            ? <CheckOutlined className="text-green-500 text-[10px]" /> 
                            : <CloseOutlined className="text-red-300 text-[10px]" />}
                          <Text className={`text-[10px] ${rt.breakfastIncluded ? 'text-gray-600' : 'text-gray-400'}`}>
                            {rt.breakfastIncluded ? 'Bao gồm ăn sáng' : 'Không ăn sáng'}
                          </Text>
                        </div>
                        <div className="flex items-center gap-1">
                          <InfoCircleOutlined className="text-blue-400 text-[10px]" />
                          <Text className="text-[10px] text-gray-500">{rt.refundPolicy || 'Linh hoạt'}</Text>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Price + Button */}
                    <div className="flex-shrink-0 md:w-[180px] flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 mt-3 md:mt-0 md:pl-4 md:border-l md:border-gray-100">
                      <div className="text-right">
                        <Text className="text-xl font-black text-[#f97316] block leading-none">
                          {new Intl.NumberFormat('vi-VN').format(rt.basePrice)}₫
                        </Text>
                        <Text className="text-[9px] text-gray-400 block">/đêm (đã gồm thuế)</Text>
                        {rt.availableRooms > 0 && rt.availableRooms <= 5 && (
                          <div className="mt-1">
                            <span className="inline-block bg-orange-50 text-[#f97316] text-[9px] font-semibold px-2 py-0.5 rounded-full">
                              Chỉ còn {rt.availableRooms} phòng
                            </span>
                          </div>
                        )}
                        {rt.availableRooms > 5 && (
                          <Text className="text-[10px] text-green-600 block mt-1">Còn {rt.availableRooms} phòng</Text>
                        )}
                        {rt.availableRooms <= 0 && (
                          <Text className="text-[10px] text-red-500 block mt-1 font-medium">Hết phòng</Text>
                        )}
                      </div>
                      <button
                        disabled={rt.availableRooms <= 0 || !selectedDates}
                        onClick={() => handleSelectRoomType(rt)}
                        className={`
                          px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap
                          ${rt.availableRooms > 0 && selectedDates
                            ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          }
                        `}
                      >
                        {rt.availableRooms <= 0 ? 'Hết phòng' : 'Chọn'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* RIGHT: SIDEBAR */}
          <Col xs={24} lg={8}>
            <div className="sticky top-28 space-y-5">
              {/* THÔNG TIN ĐẶT PHÒNG */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Title level={5} className="!text-sm !font-bold !mb-4 !text-gray-800">
                  <InfoCircleOutlined className="mr-2 text-[#f97316]" />
                  Thông tin đặt phòng
                </Title>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleFilled className="text-green-500 text-sm mt-0.5" />
                    <div>
                      <Text className="text-sm font-medium text-gray-700 block">Giá tốt nhất</Text>
                      <Text className="text-xs text-gray-400">Cam kết giá rẻ nhất thị trường</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleFilled className="text-green-500 text-sm mt-0.5" />
                    <div>
                      <Text className="text-sm font-medium text-gray-700 block">Hủy phòng linh hoạt</Text>
                      <Text className="text-xs text-gray-400">{roomTypes[0]?.refundPolicy || 'Miễn phí hủy theo chính sách'}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleFilled className="text-green-500 text-sm mt-0.5" />
                    <div>
                      <Text className="text-sm font-medium text-gray-700 block">Thanh toán an toàn</Text>
                      <Text className="text-xs text-gray-400">Bảo mật thông tin tuyệt đối</Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOTLINE */}
              <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-6 rounded-2xl shadow-lg text-white text-center">
                <Text className="text-[10px] uppercase tracking-[0.2em] font-bold block mb-2 opacity-80">Hotline hỗ trợ</Text>
                <Text className="text-2xl font-black block tracking-tight">0866.981.044</Text>
                <Text className="text-xs mt-2 block opacity-70">Hỗ trợ 24/7</Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}