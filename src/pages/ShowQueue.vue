<template>
  <div style="margin: 0.5rem">
    <v-toolbar class="page-sidebar">
        <img src="static/logo.png" width="100vh"></img>
       <h3>{{ headerProject }}</h3> 
    </v-toolbar>
    <v-toolbar
      style="margin-top: 0.5rem"
      xs12
      sm8
      color="#f8c849"
      dark
      tabs
      v-if="dataQueue.length == 0"
    >
      <v-layout justify-center style="font-size: larger">
        ไม่มีข้อมูลบริษัทที่ต้องเข้าส่งสินค้า
      </v-layout>
    </v-toolbar>

    <v-layout row wrap v-if="dataQueue.length > 0">
      <!-- Current Queue Heading -->
      <v-flex xs12>
        <v-container>
          <h3
            style="
              text-align: center;
              color: white;
              background-color: #007fc4;
              border-radius: 10px;
              padding: 10px;
              margin-bottom: -2.1rem;
            "
          >
            คิวปัจจุบัน
          </h3>
        </v-container>
      </v-flex>

      <!-- Left Side (50% on medium and up, full width on mobile) -->
      <v-flex md12 xs12>
        <v-container>
          <v-card   class="pa-4 elevation-4 rounded-lg"
          style="background: linear-gradient(135deg, #bbdefb, #e3f2fd);">
            <v-layout row wrap justify-end  style="margin-top: -1rem;" v-if="remainingTime <= 15 && remainingTime > 0 && dataQueue[0].checkIn == ''">
                <v-chip
                    color="pink lighten-5"
                    text-color="red"
                    large
                    outlined
                    class="ma-2"
                    style="font-size: larger"
                    >
                    <v-icon left color="pink darken-3">mdi-lightbulb-on-30</v-icon>
                    อีก {{ remainingTime }} นาที ถึงเวลาเช็คอิน
                    </v-chip>
          </v-layout>
            <v-card-title class="text-h5" style="font-size: x-large">
              <v-icon left color="primary">mdi-office-building</v-icon>
              ชื่อบริษัท : {{ dataQueue.length == 0 ? "-" : dataQueue[0].vendorDesc }}
            </v-card-title>
            <v-divider class="my-2"></v-divider>
            <v-card-text>
              <!-- First Row: Driver and Phone -->
      
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-account</v-icon>
                  <strong>คนขับรถ :</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].driverName }}
                </v-flex>

                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-car</v-icon>
                  <strong>ป้ายทะเบียนรถ :</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].plate }}
                </v-flex>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-phone</v-icon>
                  <strong>เบอร์โทร :</strong>
                  {{
                    formatPhoneNumber(
                      dataQueue.length == 0 ? "-" : dataQueue[0].driverPhone
                    )
                  }}
                </v-flex>
              </v-layout>

              <!-- Second Row: Check-in and Check-out Times -->
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-clock-outline</v-icon>
                  <strong>เวลาเริ่ม :</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeStart }} น.
                </v-flex>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-clock-end</v-icon>
                  <strong>เวลาที่สิ้นสุด :</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeEnd }} น.
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider class="my-2"></v-divider>
            <v-card-text v-if="dataQueue.length > 0 && dataQueue[0].checkIn !== ''">
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-bus-clock</v-icon>
                  <strong>เวลาเช็คอิน :</strong>
                  {{ dataQueue.length == 0 ? "-" : functions.formatDateFormat(dataQueue[0].checkIn)  }} น.
                </v-flex>
                <v-flex xs12 md6 class="mb-2"  v-if="dataQueue.length > 0 && dataQueue[0].checkIn !== ''">
                  <v-icon left color="primary">mdi-clock-star-four-points-outline</v-icon>
                  <strong>เวลาที่ใช้ไป :</strong>
                  {{ dataQueue.length == 0 ? "-" : PassedTimeDifference(dataQueue[0].checkIn) }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
    <!-- ส่วนที่ 2  -->
    <v-layout row wrap v-if="dataQueue.length > 1">
      <!-- Current Queue Heading -->
      <v-flex xs12>
        <v-container>
          <h3
            style="
              text-align: center;
              color: white;
              background-color: #007fc4;
              border-radius: 10px;
              padding: 10px;
              margin-bottom: -2.1rem;
            "
          >
            คิวถัดไป
          </h3>
        </v-container>
      </v-flex>

      <!-- Left Side (50% on medium and up, full width on mobile) -->
      <v-flex md12 xs12>
        <v-container>
          <v-card class="pa-4 elevation-4 rounded-lg">
            <v-layout row wrap justify-end  style="margin-top: -1rem;" v-if="remainingTimeQueue1 <= 15 && remainingTimeQueue1 > 0 && dataQueue[1].checkIn == ''">
                <v-chip
                    color="pink lighten-5"
                    text-color="red"
                    large
                    outlined
                    class="ma-2"
                    style="font-size: 1rem;"
                    >
                    <v-icon left color="pink darken-3">mdi-lightbulb-on-30</v-icon>
                    อีก {{remainingTimeQueue1}} นาที ถึงเวลาเช็คอิน
                    </v-chip>
          </v-layout>
            <v-card-title class="text-h5">
              <v-icon left color="primary">mdi-office-building</v-icon>
              ชื่อบริษัท : {{ dataQueue.length == 0 ? "-" : dataQueue[1].vendorDesc }}
            </v-card-title>
            <v-divider class="my-2"></v-divider>
            <v-card-text>
              <!-- First Row: Driver and Phone -->
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-account</v-icon>
                  <strong>คนขับรถ:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[1].driverName }}
                </v-flex>

                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-car</v-icon>
                  <strong>ป้ายทะเบียนรถ:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[1].plate }}
                </v-flex>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-phone</v-icon>
                  <strong>เบอร์โทร:</strong>
                  {{
                    formatPhoneNumber(
                      dataQueue.length == 0 ? "-" : dataQueue[1].driverPhone
                    )
                  }}
                </v-flex>
              </v-layout>

              <!-- Second Row: Check-in and Check-out Times -->
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-clock-outline</v-icon>
                  <strong>เวลาเริ่ม:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[1].timeStart }} น.
                </v-flex>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-clock-end</v-icon>
                  <strong>เวลาที่สิ้นสุด:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[1].timeEnd }} น.
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider class="my-2"></v-divider>
            <v-card-text v-if="dataQueue.length > 0 && dataQueue[1].checkIn !== ''">
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-bus-clock</v-icon>
                  <strong>เวลาเช็คอิน:</strong>
                  {{ dataQueue.length == 0 ? "-" : functions.formatDateFormat(dataQueue[1].checkIn) }} น.
                </v-flex>
                <v-flex xs12 md6 class="mb-2"  v-if="dataQueue.length > 0 && dataQueue[1].checkIn !== ''">
                  <v-icon left color="primary">mdi-clock-star-four-points-outline</v-icon>
                  <strong>เวลาที่ใช้ไป :</strong>
                  {{ dataQueue.length == 0 ? "-" : functions.formatDateFormat(dataQueue[1].checkIn) }} น.
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { sync } from "vuex-pathify";
import functions from '@/plugins/functions';
export default {
  data() {
    return {
      dataQueue: [],
      functions,
      currentTime: new Date(),
      remainingTime: 0,
      remainingTimeQueue1: 0,
      minutesPassed: 0, // เวลาที่ผ่านไป
    };
  },
  async created() {
    this.$store.commit("resetState");
    this.searchTruckQueue();
  },
    mounted() {
      // Call searchTruckQueue every 3 seconds (3000 ms)
      this.intervalId = setInterval(() => {
        this.currentTime = new Date(); // อัปเดตเวลาปัจจุบัน
       
        this.searchTruckQueue();
      }, 10000);
    },
  beforeDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  computed: {
    ...sync("*"),
  },
  methods: {
    PassedTimeDifference(timeString) {
        const year = parseInt(timeString.substring(0, 4));
const month = parseInt(timeString.substring(4, 6)) - 1; // เดือนใน JavaScript นับจาก 0
const day = parseInt(timeString.substring(6, 8));
const hours = parseInt(timeString.substring(9, 11));
const minutes = parseInt(timeString.substring(12, 14));

const mDateTime = new Date(year, month, day, hours, minutes);
const now = new Date();

const diffMs = now - mDateTime; // ความแตกต่างใน milliseconds
const diffMins = Math.floor(diffMs / 60000); // แปลง milliseconds เป็นนาที

if (diffMins > 0) {
  const hoursPassed = Math.floor(diffMins / 60); // คำนวณชั่วโมงที่ผ่านไป
  const minutesPassed = diffMins % 60; // นาทีที่เหลือ
  return `${hoursPassed} ชม. ${minutesPassed} นาที`;
} else {
  return "0 ชม. 0 นาที"; // แสดงผลเป็น 0 ถ้าเวลายังไม่ถึง
}
    },
    setTargetTime(timeString) {
        console.log(timeString, 'Time')
      // รับค่าเวลา เช่น "14:30" และสร้าง Date object ที่มีเวลานั้นในวันปัจจุบัน
      const today = new Date();
      const [hours, minutes] = timeString.split(":"); // แยกชั่วโมงและนาทีจาก timeString
      const target = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
      const now = new Date();
      const diffMs = target - now; // ความแตกต่างระหว่างเวลาที่กำหนดกับปัจจุบันใน milliseconds
      const diffMins = Math.floor(diffMs / 60000); // แปลง milliseconds เป็นนาที
      return diffMins > 0 ? diffMins : 0; // ถ้าเวลาผ่านไปแล้ว แสดง 0
    },

    formatPhoneNumber(phone) {
      if (!phone || phone.length !== 10) {
        return phone;
      }
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    },
    async searchTruckQueue() {
      this.dataQueue = [];
      this.rawData = [];
      this.loadingDialog = true;
      const response = await axios.get(
        `${this.Endpoint}/TruckQueue/v1/GetPlanQueueToDay`
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        response.data.results.forEach((element, index) =>
          this.dataQueue.push({
            index: index + 1,
            planID: element.planID,
            planDate: element.planDate,
            vendorNo: element.vendorNo,
            vendorDesc: element.vendorDesc,
            timeEnd: element.timeEnd,
            timeStart: element.timeStart,
            remark: element.remark,
            createBy: element.createBy,
            updateBy: element.updateBy,
            status: element.status,
            purchaseOrderNo: element.purchaseOrderNo,
            driverName: element.driverName,
            driverPhone: element.driverPhone,
            plate: element.plate,
            checkIn: element.checkIn,
            checkOut: element.checkOut,
          })
        );
        this.remainingTime = this.setTargetTime(this.dataQueue[0].timeStart)
        this.remainingTimeQueue1 = this.dataQueue.length > 1 ? this.setTargetTime(this.dataQueue[1].timeStart) : 0
      } else {
        this.loadingDialog = false;
        Swal.fire({
          text: `Internal Server Error`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      }
    },
  },
};
</script>

<style scoped>
/* Additional card styling */
.v-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
.theme--light.v-icon {
  color: #007fc4;
}
/* ปรับขนาดตัวอักษรพื้นฐาน */
body {
  font-size: 1.2rem; /* ปรับขนาดเริ่มต้นใหญ่ขึ้น */
}

/* ปรับขนาดตัวอักษรสำหรับ v-card */
.v-card {
  font-size: 1.3rem; /* ขนาดตัวอักษรของ v-card */
}

/* ปรับขนาดตัวอักษรของ heading */
h3 {
  font-size: 1.6rem; /* ขนาดใหญ่ขึ้นสำหรับหัวข้อ */
}

/* ปรับขนาดตัวอักษรของข้อความหลัก */
strong {
  font-size: 1.3rem; /* ปรับขนาดข้อความตัวหนา */
}

/* ปรับขนาดตัวอักษรสำหรับจอมือถือ */
@media only screen and (max-width: 600px) {
  body {
    font-size: 1.1rem; /* ขนาดที่เล็กลงสำหรับมือถือ */
  }
  
  h3 {
    font-size: 1.4rem; /* ขนาดหัวข้อสำหรับมือถือ */
  }

  strong {
    font-size: 1.2rem; /* ขนาดตัวอักษรที่เหมาะกับมือถือ */
  }

  .v-card {
    font-size: 1.2rem; /* ปรับขนาดตัวอักษรใน v-card สำหรับมือถือ */
  }

  .v-toolbar {
    font-size: 1.1rem; /* ขนาดตัวอักษรในแถบเครื่องมือ */
  }
}
</style>
