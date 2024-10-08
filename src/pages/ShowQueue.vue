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
          <v-card class="pa-4 elevation-4 rounded-lg">
            <v-card-title class="text-h5">
              <v-icon left color="primary">mdi-office-building</v-icon>
              ชื่อบริษัท : {{ dataQueue.length == 0 ? "-" : dataQueue[0].vendorDesc }}
            </v-card-title>
            <v-divider class="my-2"></v-divider>
            <v-card-text>
              <!-- First Row: Driver and Phone -->
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-account</v-icon>
                  <strong>คนขับรถ:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].driverName }}
                </v-flex>

                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-car</v-icon>
                  <strong>ป้ายทะเบียนรถ:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].plate }}
                </v-flex>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-phone</v-icon>
                  <strong>เบอร์โทร:</strong>
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
                  <strong>เวลาเริ่ม:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeStart }} น.
                </v-flex>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-clock-end</v-icon>
                  <strong>เวลาที่สิ้นสุด:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeEnd }} น.
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider class="my-2"></v-divider>
            <v-card-text v-if="dataQueue.length > 0 && dataQueue[0].checkIn !== ''">
              <v-layout row wrap>
                <v-flex xs12 md6 class="mb-2">
                  <v-icon left color="primary">mdi-bus-clock</v-icon>
                  <strong>เวลาเช็คอิน:</strong>
                  {{ dataQueue.length == 0 ? "-" : dataQueue[0].checkIn }} น.
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
                  {{ dataQueue.length == 0 ? "-" : dataQueue[1].checkIn }} น.
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

export default {
  data() {
    return {
      dataQueue: [],
    };
  },
  async created() {
    this.$store.commit("resetState");
    this.searchTruckQueue();
  },
  //   mounted() {
  //     // Call searchTruckQueue every 3 seconds (3000 ms)
  //     this.intervalId = setInterval(() => {
  //       this.searchTruckQueue();
  //     }, 5000);
  //   },
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
</style>
