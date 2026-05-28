"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { Card, DatePicker, Button, Typography, Divider, Spin, App, Space, Breadcrumb, Radio, Row, Col } from 'antd';
import { CalendarOutlined, ShopOutlined, CheckCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function BookingContent() {
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelData = await hotelService.getHotelById(hotelId!);
        // Tìm phòng cụ thể trong danh sách roomTypes
        let foundRoom: any = null;
        hotelData.roomTypes.forEach((type: any) => {
          const r = type.rooms.find((rm: any) => rm.id.toString() === roomId);
          if (r) foundRoom = { ...r, typeName: type.name, basePrice: type.basePrice };
        });
        setData({ hotel: hotelData, room: foundRoom });
      } catch (e) {
        message.error("Lỗi tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };
    if (hotelId && roomId) fetchData();
  }, [hotelId, roomId]);

  const handleConfirm = async () => {
    if (!dates) return message.warning("Vui lòng chọn ngày nhận/trả phòng");
    setSubmitting(true);
    try {
      const payload = {
        hotelId: parseInt(hotelId!),
        roomId: parseInt(roomId!),
        checkInDate: dates[0].format('YYYY-MM-DD'),
        checkOutDate: dates[1].format('YYYY-MM-DD'),
        paymentMethod: 'CASH'
      };
      const res = await bookingService.createBooking(payload);
      message.success(res.message);
      router.push('/');
    } catch (e) {
      message.error("Đặt phòng thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f9f7f2]"><Spin size="large" /></div>;

  const nights = dates ? dates[1].diff(dates[0], 'day') : 1;
  const total = (data?.room?.basePrice || 0) * (nights || 1);

  return (
    <div className="min-h-screen bg-[#f9f7f2] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Title level={2} className="text-center mb-12 uppercase tracking-widest" style={{ fontFamily: 'serif' }}>Xác Nhận Đặt Phòng</Title>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={14}>
            <Card variant="borderless" className="rounded-2xl shadow-sm mb-6">
              <Title level={4} className="mb-6"><CalendarOutlined className="text-[#c5a059]" /> Thời gian lưu trú</Title>
              <DatePicker.RangePicker 
                className="w-full h-12 rounded-xl"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                onChange={(val) => setDates(val)}
              />
              <p className="mt-4 text-gray-400 text-xs italic">* Vui lòng kiểm tra kỹ ngày nhận và trả phòng.</p>
            </Card>

            <Card variant="borderless" className="rounded-2xl shadow-sm">
              <Title level={4} className="mb-6">💳 Phương thức thanh toán</Title>
              <Radio.Group value="CASH" className="w-full">
                <div className="p-4 border-2 border-[#c5a059] bg-[#f9f7f2] rounded-xl flex items-center justify-between">
                  <Radio value="CASH"><Text strong>Thanh toán bằng tiền mặt</Text></Radio>
                  <Text className="text-gray-400 text-xs">Tại khách sạn</Text>
                </div>
              </Radio.Group>
            </Card>
          </Col>

          <Col xs={24} md={10}>
            <Card variant="borderless" className="rounded-2xl shadow-xl bg-[#1a1a1a] text-white">
              <Title level={4} className="!text-white mb-1">{data?.hotel?.name}</Title>
              <Text className="text-gray-400 text-xs block mb-6"><ShopOutlined /> {data?.hotel?.address}</Text>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Text className="text-gray-400">Loại phòng</Text>
                  <Text className="text-white font-bold">{data?.room?.typeName}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-400">Số phòng</Text>
                  <Text className="text-[#c5a059] font-bold">{data?.room?.roomNumber}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-400">Thời gian</Text>
                  <Text className="text-white">{nights} đêm</Text>
                </div>
                <Divider className="bg-gray-800" />
                <div className="flex justify-between items-center">
                  <Text className="text-lg">Tổng cộng</Text>
                  <Text className="text-2xl font-black text-[#c5a059]">
                    {new Intl.NumberFormat('vi-VN').format(total)}đ
                  </Text>
                </div>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  loading={submitting}
                  onClick={handleConfirm}
                  className="!bg-[#c5a059] !text-black border-none h-14 rounded-xl font-bold mt-6 hover:scale-105 transition-all"
                >
                  XÁC NHẬN ĐẶT PHÒNG
                </Button>
              </div>
            </Card>
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