<template>
  <div style="margin: 0.5rem">
    <v-toolbar
      style="margin-top: 0.5rem"
      xs12
      sm8
      color="#f8c849"
      dark
      tabs
      v-if="dataQueue.length == 0"
    >
      <v-layout justify-center style="font-size: larger"
        >ไม่มีข้อมูลบริษัทที่ต้องเข้าส่งสินค้า
      </v-layout>
    </v-toolbar>
    <v-layout row wrap v-if="dataQueue.length > 0">
      <!-- Left Side (50% on medium and up, full width on mobile) -->
      <v-flex md6 xs12>
        <v-container>
          <v-card class="pa-4 elevation-4 rounded-lg">
            <v-card-title class="text-h5">
              <v-icon left color="primary">mdi-office-building</v-icon>
              ชื่อบริษัท : {{ dataQueue.length == 0 ? "-" : dataQueue[0].vendorDesc }}
            </v-card-title>
            <v-divider class="my-2"></v-divider>
            <v-card-text>
              <div class="mb-2">
                <v-icon left color="primary">mdi-account</v-icon>
                <strong>คนขับรถ:</strong>
                {{ dataQueue.length == 0 ? "-" : dataQueue[0].driverName }}
              </div>
              <div class="mb-2">
                <v-icon left color="primary">mdi-car</v-icon>
                <strong>ป้ายทะเบียนรถ:</strong>
                {{ dataQueue.length == 0 ? "-" : dataQueue[0].plate }}
              </div>
              <div class="mb-2">
                <v-icon left color="primary">mdi-phone</v-icon>
                <strong>เบอร์โทร:</strong>
                {{
                  formatPhoneNumber(
                    dataQueue.length == 0 ? "-" : dataQueue[0].driverPhone
                  )
                }}
              </div>
              <div class="mb-2">
                <v-icon left color="primary">mdi-clock-outline</v-icon>
                <strong>เวลาเริ่ม:</strong>
                {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeStart }} น.
              </div>
              <div>
                <v-icon left color="primary">mdi-clock-end</v-icon>
                <strong>เวลาที่สิ้นสุด:</strong>
                {{ dataQueue.length == 0 ? "-" : dataQueue[0].timeEnd }} น.
              </div>
              <v-divider class="my-2"></v-divider>
              <v-layout
                row
                wrap
                v-if="
                  ['TruckQueue_Verify'].some((i) => infoLogin.group.includes(i)) ||
                  (['TruckQueue_Admin'].some((i) => infoLogin.group.includes(i)) &&
                    dataQueue[0].checkIn != '')
                "
              >
                <v-flex xs12 sm6 md6>
                  <v-autocomplete
                    v-model="mReason"
                    prepend-icon="mdi-alert-octagon-outline"
                    :items="itemReason"
                    item-value="reasonID"
                    item-text="reasonDesc"
                    dense
                    label="ปัญหาที่พบ"
                    return-object
                    hide-details
                    class="custom-autocomplete"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12 v-if="mReason.reasonID == 'R999'">
                  <v-textarea
                    v-model="fRemark"
                    prepend-icon="mdi-note-text-outline"
                    maxlength="100"
                    counter="100"
                    rows="2"
                    label="สาเหตุเกิดจาก"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider class="my-2"></v-divider>
            <v-card-actions v-if="dataQueue.length > 0">
              <v-layout
                row
                wrap
                justify-center
                v-if="
                  ['TruckQueue_Verify'].some((i) => infoLogin.group.includes(i)) ||
                  ['TruckQueue_Admin'].some((i) => infoLogin.group.includes(i))
                "
              >
                <v-flex
                  xs12
                  md4
                  class="pa-1"
                  v-if="dataQueue.length > 0 && dataQueue[0].checkIn == ''"
                >
                  <v-btn
                    color="primary"
                    outlined
                    rounded
                    block
                    @click="updateStatusAndCheckInOut('CheckIn')"
                  >
                    <v-icon left>mdi-check</v-icon>
                    เช็คอิน
                  </v-btn>
                </v-flex>
                <v-flex
                  xs12
                  md4
                  class="pa-1"
                  v-if="dataQueue.length > 0 && dataQueue[0].checkIn != ''"
                >
                  <v-btn
                    color="primary"
                    outlined
                    rounded
                    block
                    @click="updateStatusAndCheckInOut('CheckOut')"
                  >
                    <v-icon left>mdi-logout</v-icon>
                    เช็คเอาท์
                  </v-btn>
                </v-flex>
                <v-flex
                  xs12
                  md4
                  class="pa-1"
                  v-if="dataQueue.length > 0 && dataQueue[0].checkIn == ''"
                >
                  <v-btn
                    color="red"
                    dark
                    rounded
                    block
                    @click="updateStatusAndCheckInOut('TIMEOUT')"
                  >
                    <v-icon left>mdi-close</v-icon>
                    เกินเวลา
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>

      <!-- Right Side (50% on medium and up, full width on mobile) -->
      <v-flex md6 xs12>
        <v-container>
          <!-- Data Table -->
          <v-data-table
            :headers="headers"
            :items="dataQueue"
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPageItem"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.index }}</td>
                <td>{{ props.item.vendorDesc }}</td>
                <td>{{ props.item.timeStart }}</td>
                <td>{{ props.item.timeEnd }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { sync } from "vuex-pathify";
import Loading from "@/components/core/Loading";
import { watch } from "vue";

export default {
  comments: {
    Loading,
  },
  data() {
    return {
      headers: [
        { text: "ลำดับ", value: "index", align: "left", sortable: false },
        { text: "ชื่อบริษัท", value: "vendorDesc", align: "left", sortable: false },
        { text: "เวลาเริ่ม", value: "timeStart", align: "left", sortable: false },
        { text: "เวลาสิ้นสุด", value: "timeEnd", align: "left", sortable: false },
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 10,
        totalItems: 0,
      },
      rowsPerPageItem: [
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ],
      dataQueue: [],
      itemReason: [],
      mReason: { reasonID: "R000", reasonDesc: "ไม่พบปัญหา" },
      fRemark: "",
    };
  },
  async created() {
    this.$store.commit("resetState");
    this.searchTruckQueue();
    this.getReason();
  },
  computed: {
    ...sync("*"),
  },
  watch: {
    mReason(val) {
      if (val.reasonID !== "R000") return (this.fRemark = "");
    },
  },
  methods: {
    formatPhoneNumber(phone) {
      if (!phone || phone.length !== 10) {
        return phone;
      }
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    },

    async getReason() {
      this.loadingDialog = true;
      const response = await axios.get(`${this.Endpoint}/TruckQueue/v1/GetReason`);
      if (response.data.status == 200) {
        this.itemReason = response.data.results;
      }
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
      } else if (response.data.status == 404) {
        return (this.loadingDialog = false);
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
    async updateStatusAndCheckInOut(status) {
      var msg = "";
      if (status == "CheckIn") {
        msg = "ยืนยันให้บริษัทขนส่งสามารถเข้าส่งสินค้าได้ ?";
      } else if (status == "CheckOut") {
        msg = "บริษัทขนส่งทำการส่งสินค้าเสร็จสิ้นแล้ว ?";
      } else {
        msg = "บริษัทขนส่งไม่ได้มาตามเวลาที่กำหนด ?";
      }
      Swal.fire({
        text: `${msg}`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const elementJson = [
            {
              purchaseOrderNo: this.dataQueue[0].purchaseOrderNo,
              planDate: this.dataQueue[0].planDate,
              vendorNo: this.dataQueue[0].vendorNo,
              updateBy: this.infoLogin.empId,
              plate: this.dataQueue[0].plate,
              driverName: this.dataQueue[0].driverName,
              driverPhone: this.dataQueue[0].driverPhone,
              status: status,
              reasonID: dataQueue[0].checkIn != "" ? this.mReason.reasonID : "",
              reasonDesc:
                dataQueue[0].checkIn != ""
                  ? this.mReason.reasonID == "R999"
                    ? this.fRemark
                    : this.mReason.reasonDesc
                  : "",
            },
          ];
          const response = await axios.post(
            ` ${this.Endpoint}/TruckQueue/v1/UpdateTruckQueue`,
            elementJson
          );
          if (response.data.status == 200) {
            this.loadingDialog = false;
            Swal.fire({
              text: `Successfully`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.searchTruckQueue();
                this.getReason();
              }
            });
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
        }
      });
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
</style>
