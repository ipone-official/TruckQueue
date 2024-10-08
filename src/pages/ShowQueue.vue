<template>
    <div style="margin: 0.5rem">
        <v-toolbar class="page-sidebar">
            <img src="static/logo.png" width="100vh"></img>
            <h3>{{ headerProject }}</h3>
        </v-toolbar>
        <v-toolbar style="margin-top: 0.5rem" xs12 sm8 color="#f8c849" dark tabs v-if="dataQueue.length == 0">
            <v-layout justify-center style="font-size: larger">
                ไม่มีข้อมูลบริษัทที่ต้องเข้าส่งสินค้า
            </v-layout>
        </v-toolbar>

        <v-layout row wrap v-if="dataQueue.length > 0">
            <!-- Current Queue Heading -->
            <v-flex xs12>
                <v-container style="
      color: white;
      background-color: #007fc4;
      border-radius: 10px;
      padding: 10px;
      margin-top: 1rem;
    ">
                    <!-- กรณีที่ checkIn ยังไม่เสร็จ -->
                    <v-layout v-if="dataQueue.length > 0 && dataQueue[0].checkIn == ''" row wrap justify-space-between
                        align-center>
                        <!-- คิวปัจจุบัน อยู่ซ้าย -->
                        <v-flex xs4 md6>
                            <h3 style="margin: 0;">
                                คิวปัจจุบัน
                            </h3>
                        </v-flex>

                        <!-- เกินเวลาเช็คอิน อยู่ขวา -->
                        <v-flex xs8 md6 style="text-align: right;">
                            <v-chip color="pink lighten-5" text-color="red" large outlined class="ma-2"
                                style="font-size: medium;">
                                <v-icon left color="pink darken-3">mdi-timer-sand</v-icon>
                              <h5>
                               {{ Math.abs(remainingTime) <= 15 ? `อีก ${Math.abs(remainingTime)} ถึงเวลาเช็คอิน` :
                                    `เกินเวลาเช็คอิน ${formatTimeConvert(Math.abs(remainingTime))}` }} </h5> 
                                    </v-chip> 
                        </v-flex>
                    </v-layout>

                    <!-- กรณีที่ checkIn เสร็จแล้ว ให้ "คิวปัจจุบัน" อยู่กึ่งกลาง -->
                    <v-layout v-else row wrap justify-center align-center>
                        <v-flex xs12>
                            <h3 style="margin: 0; text-align: center;">
                                คิวปัจจุบัน
                            </h3>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <!-- Left Side (50% on medium and up, full width on mobile) -->
            <v-flex md12 xs12>
                <v-container>
                    <v-card class="pa-4 elevation-4 rounded-lg"
                        style="background: linear-gradient(135deg, #bbdefb, #e3f2fd);">


                        <v-card-title class="text-h5">
                            <v-icon left color="primary">mdi-office-building</v-icon>
                            ชื่อบริษัท : {{ dataQueue.length == 0 ? "-" : dataQueue[0].vendorDesc }}
                        </v-card-title>
                        <v-divider class="my-2"></v-divider>
                        <v-card-text>
                            <!-- First Row: Driver and Phone -->

                            <v-layout row wrap>
                                <!-- คนขับรถ -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                        <v-icon left color="primary">mdi-account</v-icon>
                                        <strong style="margin-left: 8px;">คนขับรถ :</strong>
                                        <span style="margin-left: 8px;">
                                            {{ dataQueue.length == 0 ? "-" : dataQueue[0].driverName }}
                                        </span>
                                    </v-layout>
                                </v-flex>

                                <!-- ป้ายทะเบียนรถ -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                        <v-icon left color="primary">mdi-car</v-icon>
                                        <strong style="margin-left: 8px;">ป้ายทะเบียนรถ :</strong>
                                        <span style="margin-left: 8px;">
                                            {{ dataQueue.length == 0 ? "-" : dataQueue[0].plate }}
                                        </span>
                                    </v-layout>
                                </v-flex>

                                <!-- เบอร์โทร -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                        <v-icon left color="primary">mdi-phone</v-icon>
                                        <strong style="margin-left: 8px;">เบอร์โทร :</strong>
                                        <span style="margin-left: 8px;">
                                            {{
                                                formatPhoneNumber(
                                                    dataQueue.length == 0 ? "-" : dataQueue[0].driverPhone
                                                )
                                            }}
                                        </span>
                                    </v-layout>
                                </v-flex>
                            </v-layout>


                            <!-- Second Row: Check-in and Check-out Times -->
                            <v-layout row wrap>
                                <!-- เวลาเริ่ม -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-clock-outline</v-icon>
                                    <strong style="margin-left: 8px;">เวลาเริ่ม :</strong>
                                    <span style="margin-left: 8px;">
                                        {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeStart }} น.
                                    </span>
                                    </v-layout>
                                </v-flex>

                                <!-- เวลาที่สิ้นสุด -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-clock-end</v-icon>
                                    <strong style="margin-left: 8px;">เวลาที่สิ้นสุด :</strong>
                                    <span style="margin-left: 8px;">
                                        {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeEnd }} น.
                                    </span>
                                    </v-layout>
                                </v-flex>
                                </v-layout>


                        </v-card-text>
                        <v-divider class="my-2" v-if="dataQueue.length > 0 && dataQueue[0].checkIn !== ''"></v-divider>
                        <v-card-text v-if="dataQueue.length > 0 && dataQueue[0].checkIn !== ''">
                            <v-layout row wrap>
                                <!-- เวลาเช็คอิน -->
                                <v-flex xs12 md6 class="mb-2">
                                <v-layout row align-center>
                                    <v-icon left color="primary">mdi-bus-clock</v-icon>
                                    <strong style="margin-left: 8px;">เวลาเช็คอิน:</strong>
                                    <span style="margin-left: 8px;">
                                    {{ dataQueue.length == 0 ? "-" : functions.formatDateFormat(dataQueue[0].checkIn) }} น.
                                    </span>
                                </v-layout>
                                </v-flex>

                                <!-- เวลาที่ใช้ไป -->
                                <v-flex xs12 md6 class="mb-2" v-if="dataQueue.length > 0 && dataQueue[0].checkIn !== ''">
                                <v-layout row align-center>
                                    <v-icon left color="primary">mdi-clock-star-four-points-outline</v-icon>
                                    <strong style="margin-left: 8px;">เวลาที่ใช้ไป:</strong>
                                    <span style="margin-left: 8px;">
                                    {{ dataQueue.length == 0 ? "-" : PassedTimeDifference(dataQueue[0].checkIn) }}
                                    </span>
                                </v-layout>
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
                <v-container style="
      color: white;
      background-color: #007fc4;
      border-radius: 10px;
      padding: 10px;
      margin-top: 1rem;
    ">
                    <v-layout v-if="dataQueue.length > 1 && dataQueue[1].checkIn == ''" row wrap justify-space-between
                        align-center>
                        <v-flex xs4 md6>
                            <h3 style="margin: 0;">
                                คิวถัดไป
                            </h3>
                        </v-flex>

                        <!-- เกินเวลาเช็คอิน อยู่ขวา -->
                        <v-flex xs8 md6 style="text-align: right;">
                            <v-chip color="pink lighten-5" text-color="red" large outlined class="ma-2"
                                style="font-size: medium;">
                                <v-icon left color="pink darken-3">mdi-timer-sand</v-icon>
                              <h5>  {{ Math.abs(remainingTimeQueue1) <= 15 ? `อีก ${Math.abs(remainingTimeQueue1)}
                                    ถึงเวลาเช็คอิน` : `เกินเวลาเช็คอิน
                                    ${formatTimeConvert(Math.abs(remainingTimeQueue1))}` }} </h5></v-chip>
                        </v-flex>
                    </v-layout>

                    <!-- กรณีที่ checkIn เสร็จแล้ว ให้ "คิวปัจจุบัน" อยู่กึ่งกลาง -->
                    <v-layout v-else row wrap justify-center align-center>
                        <v-flex xs12>
                            <h3 style="margin: 0; text-align: center;">
                                คิวถัดไป
                            </h3>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <!-- Left Side (50% on medium and up, full width on mobile) -->
            <v-flex md12 xs12>
                <v-container>
                    <v-card class="pa-4 elevation-4 rounded-lg">


                        <v-card-title class="text-h5" style="font-size: ">
                            <v-icon left color="primary">mdi-office-building</v-icon>
                            ชื่อบริษัท : {{ dataQueue.length == 1 ? "-" : dataQueue[1].vendorDesc }}
                        </v-card-title>

                        <v-divider class="my-2"></v-divider>
                        <v-card-text>
                            <!-- First Row: Driver and Phone -->
                            <v-layout row wrap>
                                <!-- คนขับรถ -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-account</v-icon>
                                    <strong style="margin-left: 8px;">คนขับรถ:</strong>
                                    <span style="margin-left: 8px;">
                                        {{ dataQueue.length == 1 ? "-" : dataQueue[1].driverName }}
                                    </span>
                                    </v-layout>
                                </v-flex>

                                <!-- ป้ายทะเบียนรถ -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-car</v-icon>
                                    <strong style="margin-left: 8px;">ป้ายทะเบียนรถ:</strong>
                                    <span style="margin-left: 8px;">
                                        {{ dataQueue.length == 1 ? "-" : dataQueue[1].plate }}
                                    </span>
                                    </v-layout>
                                </v-flex>

                                <!-- เบอร์โทร -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-phone</v-icon>
                                    <strong style="margin-left: 8px;">เบอร์โทร:</strong>
                                    <span style="margin-left: 8px;">
                                        {{
                                        formatPhoneNumber(
                                            dataQueue.length == 1 ? "-" : dataQueue[1].driverPhone
                                        )
                                        }}
                                    </span>
                                    </v-layout>
                                </v-flex>
                                </v-layout>


                            <!-- Second Row: Check-in and Check-out Times -->
                            <v-layout row wrap>
                                <!-- เวลาเริ่ม -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-clock-outline</v-icon>
                                    <strong style="margin-left: 8px;">เวลาเริ่ม:</strong>
                                    <span style="margin-left: 8px;">
                                        {{ dataQueue.length == 1 ? "-" : dataQueue[1].timeStart }} น.
                                    </span>
                                    </v-layout>
                                </v-flex>

                                <!-- เวลาที่สิ้นสุด -->
                                <v-flex xs12 md6 class="mb-2">
                                    <v-layout row align-center>
                                    <v-icon left color="primary">mdi-clock-end</v-icon>
                                    <strong style="margin-left: 8px;">เวลาที่สิ้นสุด:</strong>
                                    <span style="margin-left: 8px;">
                                        {{ dataQueue.length == 1 ? "-" : dataQueue[1].timeEnd }} น.
                                    </span>
                                    </v-layout>
                                </v-flex>
                                </v-layout>


                        </v-card-text>
                        <v-divider class="my-2" v-if="dataQueue.length > 1 && dataQueue[1].checkIn !== ''"></v-divider>
                        <v-card-text v-if="dataQueue.length > 1 && dataQueue[1].checkIn !== ''">
                        <v-layout row wrap>
                            <!-- เวลาเช็คอิน -->
                            <v-flex xs12 md6 class="mb-2">
                            <v-layout row align-center>
                                <v-icon left color="primary">mdi-bus-clock</v-icon>
                                <strong style="margin-left: 8px;">เวลาเช็คอิน:</strong>
                                <span style="margin-left: 8px;">
                                {{ dataQueue.length == 1 ? "-" : functions.formatDateFormat(dataQueue[1].checkIn) }} น.
                                </span>
                            </v-layout>
                            </v-flex>

                            <!-- เวลาที่ใช้ไป -->
                            <v-flex xs12 md6 class="mb-2" v-if="dataQueue.length > 1 && dataQueue[1].checkIn !== ''">
                            <v-layout row align-center>
                                <v-icon left color="primary">mdi-clock-star-four-points-outline</v-icon>
                                <strong style="margin-left: 8px;">เวลาที่ใช้ไป:</strong>
                                <span style="margin-left: 8px;">
                                {{ dataQueue.length == 1 ? "-" : functions.formatDateFormat(dataQueue[1].checkIn) }} น.
                                </span>
                            </v-layout>
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
    // mounted() {
    //     // Call searchTruckQueue every 3 seconds (3000 ms)
    //     this.intervalId = setInterval(() => {
    //         this.currentTime = new Date(); // อัปเดตเวลาปัจจุบัน

    //         this.searchTruckQueue();
    //     }, 10000);
    // },
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
            const today = new Date();
            const [hours, minutes] = timeString.split(":"); // แยกชั่วโมงและนาทีจาก timeString
            const target = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
            const now = new Date();
            const diffMs = target - now; // ความแตกต่างระหว่างเวลาที่กำหนดกับปัจจุบันใน milliseconds
            const diffMins = Math.floor(diffMs / 60000); // แปลง milliseconds เป็นนาที
            return diffMins
        },
        formatTimeConvert(diffMins) {
            if (diffMins > 0) {
                const hoursPassed = Math.floor(diffMins / 60); // คำนวณชั่วโมงที่ผ่านไป
                const minutesPassed = diffMins % 60; // นาทีที่เหลือ
                return `${hoursPassed} ชม. ${minutesPassed} นาที`;
            } else {
                return "0 ชม. 0 นาที"; // แสดงผลเป็น 0 ถ้าเวลายังไม่ถึง
            }
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
    font-size: 1.5rem;
    /* ปรับขนาดเริ่มต้นใหญ่ขึ้น */
}

/* ปรับขนาดตัวอักษรสำหรับ v-card */
.v-card {
    font-size: 2.3rem;
    /* ขนาดตัวอักษรของ v-card */
}

/* ปรับขนาดตัวอักษรของ heading */
h3 {
    font-size: 2.2rem;
    /* ขนาดใหญ่ขึ้นสำหรับหัวข้อ */
}

/* ปรับขนาดตัวอักษรของข้อความหลัก */
strong {
    font-size: 1.9rem;
    /* ปรับขนาดข้อความตัวหนา */
}

h5 {
    font-size: 1.3rem;
    /* ขนาดใหญ่ขึ้นสำหรับหัวข้อ */
}

/* ปรับขนาดตัวอักษรสำหรับจอมือถือ */
@media only screen and (max-width: 600px) {
    body {
        font-size: 1.3rem;
        /* ขนาดที่เล็กลงสำหรับมือถือ */
    }

    h3 {
        font-size: 1.5rem;
        /* ขนาดหัวข้อสำหรับมือถือ */
    }

    strong {
        font-size: 1.2rem;
        /* ขนาดตัวอักษรที่เหมาะกับมือถือ */
    }

    .v-card {
        font-size: 1.3rem;
        /* ปรับขนาดตัวอักษรใน v-card สำหรับมือถือ */
    }

    .v-toolbar {
        font-size: 1.0rem;
        /* ขนาดตัวอักษรในแถบเครื่องมือ */
    }
    h5 {
    font-size: 0.9rem;
    /* ขนาดใหญ่ขึ้นสำหรับหัวข้อ */
}
}
</style>
