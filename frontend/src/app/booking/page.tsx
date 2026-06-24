"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { Card, Button, Typography, Divider, Spin, App, Radio, Row, Col, Tag } from 'antd';
import { 
  CalendarOutlined, ShopOutlined, CheckCircleFilled, 
  ArrowLeftOutlined, EnvironmentOutlined, UserOutlined,
  CoffeeOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function BookingContent() {
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Đọc tham số từ URL
  const hotelId = searchParams.get('hotelId');
  const roomTypeId = searchParams.get('roomTypeId');
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Parse dates from URL
  const checkInDate = checkInStr ? dayjs(checkInStr) : null;
  const checkOutDate = checkOutStr ? dayjs(checkOutStr) : null;
  const nights = checkInDate && checkOutDate ? checkOutDate.diff(checkInDate, 'day') : 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!hotelId || !roomTypeId) {
          setError("Thiếu thông tin đặt phòng. Vui lòng quay lại chọn phòng.");
          return;
        }

        // Gọi API với checkIn/checkOut để lấy available_rooms
        const res = await hotelService.getHotelById(
          hotelId, 
          checkInStr || '', 
          checkOutStr || ''
        );

        // Tìm loại phòng trong danh sách roomTypes
        const foundRoomType = res.roomTypes?.find(
          (rt: any) => rt.id.toString() === roomTypeId
        );

        if (!foundRoomType) {
          setError("Không tìm thấy loại phòng này.");
          return;
        }

        if (foundRoomType.availableRooms <= 0) {
          setError("Rất tiếc, loại phòng này đã hết chỗ trong khoảng ngày bạn chọn.");
          return;
        }

        setData({ hotel: res.hotel, roomType: foundRoomType });
      } catch (e: any) {
        console.error("Lỗi tải thông tin:", e);
        setError("Lỗi tải thông tin đặt phòng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, roomTypeId, checkInStr, checkOutStr]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = {
        hotelId: parseInt(hotelId!),
        roomTypeId: parseInt(roomTypeId!),
        checkInDate: checkInStr,
        checkOutDate: checkOutStr,
        paymentMethod: 'CASH'
      };
      const res = await bookingService.createBooking(payload);
      message.success(res.message || "Đặt phòng thành công!");
      router.push('/');
    } catch (e: any) {
      const errMsg = e?.response?.data || "Đặt phòng thất bại, vui lòng thử lại";
      message.error(typeof errMsg === 'string' ? errMsg : "Đặt phòng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f9f7f2]">
      <Spin size="large" description="Đang tải thông tin đặt phòng..." />
    </div>
  );

  // ERROR
  if (error) return (
    <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg">
        <div className="text-5xl mb-6">😕</div>
        <Title level={4} className="!text-gray-800 !mb-3">{error}</Title>
        <Button 
          type="primary"
          onClick={() => router.back()}
          className="!bg-[#f97316] !border-none !rounded-xl !h-11 !px-8 !font-bold mt-4"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );

  if (!data) return null;

  const { hotel, roomType } = data;
  const total = roomType.basePrice * (nights || 1);

  return (
    <div className="min-h-screen bg-[#f9f7f2] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* NÚT QUAY LẠI */}
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="hover:text-[#f97316] font-bold text-xs uppercase tracking-widest mb-6 flex items-center"
        >
          Quay lại
        </Button>

        <Title level={2} className="!text-2xl !font-bold !text-gray-900 mb-8 text-center">
          Xác nhận đặt phòng
        </Title>

        <Row gutter={[24, 24]}>
          {/* LEFT: FORM */}
          <Col xs={24} md={14}>
            {/* THÔNG TIN ĐẶT */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4">
              <Title level={5} className="!text-sm !font-bold !mb-5 !text-gray-700">
                <CalendarOutlined className="mr-2 text-[#f97316]" /> Thời gian lưu trú
              </Title>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <Text className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nhận phòng</Text>
                    <Text className="text-base font-bold text-gray-800 block mt-1">
                      {checkInDate?.format('DD/MM/YYYY')}
                    </Text>
                  </div>
                  <div className="text-center">
                    <Text className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Số đêm</Text>
                    <Text className="text-lg font-black text-[#f97316] block mt-1">{nights}</Text>
                  </div>
                  <div className="text-center">
                    <Text className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Trả phòng</Text>
                    <Text className="text-base font-bold text-gray-800 block mt-1">
                      {checkOutDate?.format('DD/MM/YYYY')}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Title level={5} className="!text-sm !font-bold !mb-5 !text-gray-700">💳 Phương thức thanh toán</Title>
              <div className="p-4 border-2 border-[#f97316] bg-orange-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <Text strong className="text-gray-800">Thanh toán bằng tiền mặt</Text>
                    <Text className="text-xs text-gray-400 block">Thanh toán tại khách sạn khi nhận phòng</Text>
                  </div>
                </div>
                <Tag color="orange" className="!rounded-full !text-[10px]">Miễn phí</Tag>
              </div>
            </div>
          </Col>

          {/* RIGHT: TÓM TẮT */}
          <Col xs={24} md={10}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              {/* HOTEL INFO */}
              <div className="p-5 border-b border-gray-100">
                <Title level={5} className="!text-sm !font-bold !mb-1 !text-gray-800">{hotel.name}</Title>
                <Text className="text-xs text-gray-400 flex items-center gap-1">
                  <EnvironmentOutlined /> {hotel.address}
                </Text>
              </div>

              {/* ROOM TYPE INFO */}
              <div className="p-5 space-y-4">
                <div className="flex gap-4">
                  <img 
                    src={
                      ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=120',
                       'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=120',
                       'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=120',
                       'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=120',
                       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=120'
                      ][(roomType.id || 0) % 5]
                    }
                    className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                    alt={roomType.name}
                  />
                  <div>
                    <Text strong className="text-gray-800 block">{roomType.name}</Text>
                    <div className="flex items-center gap-1 mt-1">
                      <UserOutlined className="text-gray-400 text-[10px]" />
                      <Text className="text-[11px] text-gray-400">Tối đa {roomType.capacity} khách</Text>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CoffeeOutlined className="text-gray-400 text-[10px]" />
                      <Text className="text-[11px] text-gray-400">
                        {roomType.breakfastIncluded ? 'Có ăn sáng' : 'Không ăn sáng'}
                      </Text>
                    </div>
                  </div>
                </div>

                <Divider className="!my-0" />

                {/* CHI TIẾT GIÁ */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500 text-sm">{roomType.name}</Text>
                    <Text className="text-gray-800 font-medium">
                      {new Intl.NumberFormat('vi-VN').format(roomType.basePrice)}₫
                    </Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500 text-sm">Số đêm</Text>
                    <Text className="text-gray-800 font-medium">{nights} đêm</Text>
                  </div>
                  <div className="flex justify-between items-start">
                    <Text className="text-gray-500 text-sm flex items-center gap-1">
                      <InfoCircleOutlined className="text-gray-300" /> 
                      Chính sách hủy
                    </Text>
                    <Text className="text-xs text-gray-400 text-right max-w-[140px] leading-tight">
                      {roomType.refundPolicy || 'Linh hoạt'}
                    </Text>
                  </div>
                </div>

                <Divider className="!my-0" />

                {/* TỔNG TIỀN */}
                <div className="flex justify-between items-center">
                  <Text className="text-base font-bold text-gray-800">Tổng cộng</Text>
                  <div className="text-right">
                    <Text className="text-xl font-black text-[#f97316]">
                      {new Intl.NumberFormat('vi-VN').format(total)}₫
                    </Text>
                    <Text className="text-[10px] text-gray-400 block">Đã gồm thuế & phí</Text>
                  </div>
                </div>

                {/* NÚT XÁC NHẬN */}
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  loading={submitting}
                  onClick={handleConfirm}
                  className="!bg-gradient-to-r !from-[#f97316] !to-[#ea580c] !border-none !h-12 !rounded-xl !font-bold !text-sm !shadow-lg !shadow-orange-200 hover:!shadow-xl hover:!translate-y-[-1px] !transition-all"
                >
                  {submitting ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT PHÒNG'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                  <CheckCircleFilled className="text-green-500" />
                  <span>Bạn sẽ thanh toán tại khách sạn</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#f9f7f2]"><Spin size="large" /></div>}>
      <BookingContent />
    </Suspense>
  );
}