<template>
  <div style="margin: 1rem">
    <v-layout>
      <input
        type="file"
        ref="fileInput"
        id="fileInput"
        style="display: none"
        @change="handleFileUpload"
      />
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            @click="openFileInput"
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20">mdi-file-excel</v-icon>
          </v-btn>
        </template>
        <span>Choose File Excel</span>
      </v-tooltip>
      <span v-if="fileName" style="margin-top: 1rem">{{ fileName }}</span>
      <button v-if="fileName" style="color: red; margin-left: 1rem" @click="clearFile">
        &#10006;
      </button>
      <v-layout justify-end v-if="headers.length > 0">
        <v-tooltip top color="teal">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              @click="SubmitPlan"
              class="ma-2 small-export-button"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon size="20">mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
          <span>Export File Excel Template</span>
        </v-tooltip>
      </v-layout>
    </v-layout>
    <div v-if="activeItem == 0" style="margin-top: 0.5rem">
      <div v-if="headers.length > 0">
        <v-data-table
          :headers="headers"
          :items="DataImport"
          :search="search"
          :pagination.sync="pagination"
          :rows-per-page-items="rowsPerPageItem"
        >
          <template v-slot:items="props">
            <tr
              :style="`
    background: ${getColor(props.item)};`"
            >
              <td>{{ props.item.PurchaseOrderNo }}</td>
              <td>{{ props.item.PlanDate }}</td>

              <td class="text-xs-left">{{ props.item.VendorNo }}</td>
              <td class="text-xs-left">{{ props.item.TimeStart }}</td>
              <td class="text-xs-left">{{ props.item.TimeEnd }}</td>
              <td class="text-xs-left">{{ props.item.Remark }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>

    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import axios from "axios";
import { sync } from "vuex-pathify";
import Loading from "@/components/core/Loading";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      search: "",
      fileName: "",
      loadingDialog: false,
      activeItem: 1,
      items: [],
      headers: [],
      pagination: {
        rowsPerPage: 10,
      },
      rowsPerPageItem: [
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ],
      DataImport: [],
    };
  },
  async created() {
    this.$store.commit("resetState");
  },
  computed: {
    ...sync("*"),
  },
  methods: {
    getColor(val) {
      return val.RequiredDate ||
        val.RequiredVendor ||
        val.RequiredTimeStart ||
        val.RequiredTimeEnd
        ? "#f1948a"
        : "#82e0aa";
    },
    openFileInput() {
      this.$refs.fileInput.click(); // Trigger click on file input
    },
    handleFileUpload(event) {
      this.loadingDialog = true;
      this.activeItem = 1;
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          this.items = [sheetName];

          if (jsonData.length > 0) {
            const headerRows = jsonData.slice(0, 1); // Extract header rows
            const combinedHeaders = this.combineHeaders(headerRows);
            this.headers = combinedHeaders.map((header) => ({
              text: header,
              value: header,
              sortable: false,
            }));
            // Format time columns and convert array to objects
            const formattedData = this.formatTimeColumns(jsonData);
            this.DataImport = this.arrayToObjects(formattedData, combinedHeaders);
            this.DataImport.forEach((item, index) => {
              if (
                item.PurchaseOrderNo == "" ||
                item.PurchaseOrderNo.toString().length != 10
              ) {
                this.DataImport[index].RequiredPurchaseOrderNo = true;
              } else {
                this.DataImport[index].RequiredPurchaseOrderNo = false;
              }
              if (item.PlanDate == "" || item.PlanDate.toString().length != 8) {
                this.DataImport[index].RequiredDate = true;
              } else {
                this.DataImport[index].RequiredDate = false;
              }
              if (item.VendorNo == "") {
                this.DataImport[index].RequiredVendor = true;
              } else {
                this.DataImport[index].RequiredVendor = false;
              }
              if (item.TimeStart == "" || item.TimeStart.length != 5) {
                this.DataImport[index].RequiredTimeStart = true;
              } else {
                this.DataImport[index].RequiredTimeStart = false;
              }
              if (item.TimeEnd == "" || item.TimeEnd.length != 5) {
                this.DataImport[index].RequiredTimeEnd = true;
              } else {
                this.DataImport[index].RequiredTimeEnd = false;
              }
            });
          }
        };
        reader.readAsArrayBuffer(file);
        this.activeItem = 0;
        this.loadingDialog = false;
      } else {
        this.fileName = "";
      }
    },

    // Helper function to combine header rows into a single header array
    combineHeaders(headerRows) {
      // Combine headers if there are multiple rows; for simplicity, using the first row here
      return headerRows[0].map((header) => header.trim());
    },

    // Helper function to convert array data into an array of objects
    arrayToObjects(data, headers) {
      return data.slice(1).map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] !== undefined ? row[index] : null;
        });
        return obj;
      });
    },

    // Helper function to format time columns
    formatTimeColumns(data) {
      return data.map((row, index) => {
        if (index === 0) return row; // Skip the header row
        // Assuming TimeStart is in the 4th column (index 3) and TimeEnd is in the 5th column (index 4)
        row[3] = this.formatTime(row[3]);
        row[4] = this.formatTime(row[4]);
        return row;
      });
    },

    // Helper function to format time string
    // Helper function to format time string
    formatTime: function (timeValue) {
      // Check if the timeValue is a number (Excel time format)
      if (typeof timeValue === "number") {
        // Convert Excel time to JavaScript time
        var totalMinutes = Math.round(timeValue * 24 * 60); // Convert days to minutes
        var hours = Math.floor(totalMinutes / 60);
        var minutes = totalMinutes % 60;

        // Zero-pad hours and minutes
        hours = String(hours).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");

        return hours + ":" + minutes;
      }

      // If timeValue is a string, use regex to parse it
      if (typeof timeValue === "string") {
        // Regular expression to capture time components (HH:MM and AM/PM if present)
        var timeRegex = /(\d{1,2}):(\d{2})(:\d{2})?\s*(AM|PM)?/i;
        var match = timeValue.match(timeRegex);

        if (!match) {
          return ""; // Return an empty string if the time format is not recognized
        }

        var hours = parseInt(match[1], 10);
        var minutes = match[2];
        var ampm = match[4] ? match[4].toUpperCase() : null;

        // Convert 12-hour format to 24-hour format if needed
        if (ampm) {
          if (ampm === "PM" && hours < 12) {
            hours += 12;
          } else if (ampm === "AM" && hours === 12) {
            hours = 0;
          }
        }

        // Zero-pad hours to 2 digits
        hours = String(hours).padStart(2, "0");

        return hours + ":" + minutes;
      }

      // Return an empty string if timeValue is not recognized
      return "";
    },

    clearFile() {
      this.$refs.fileInput.value = null;
      this.headers = [];
      this.DataImport = [];
      this.fileName = "";
      this.search = "";
      this.items = [];
      this.activeItem = null;
    },
    SubmitPlan() {
      Swal.fire({
        text: `Do you want to import data into the system?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          for (let y = 0; y < this.DataImport.length; y++) {
            if (this.isDataInvalid(this.DataImport[y])) {
              this.showErrorMessage(this.items[0], y + 2);
              return; // หยุดการทำงานของฟังก์ชันทันทีเมื่อพบข้อผิดพลาด
            }
          }
          this.loadingDialog = true;
          let JsonDataImport = [];
          for (let i = 0; i < this.DataImport.length; i++) {
            const elementJson = {
              PurchaseOrderNo: this.DataImport[i].PurchaseOrderNo.toString(),
              PlanDate: this.DataImport[i].PlanDate.toString(),
              VendorNo: this.DataImport[i].VendorNo.toString(),
              TimeStart: this.DataImport[i].TimeStart.toString(),
              TimeEnd: this.DataImport[i].TimeEnd.toString(),
              Remark: this.DataImport[i].Remark ? this.DataImport[i].Remark : "",
              Createby: this.infoLogin.empId,
            };
            JsonDataImport.push(elementJson);
          }
          const response = await axios.post(
            ` ${this.Endpoint}/TruckQueue/v1/InsertPlanQueue`,
            JsonDataImport
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
                this.clearFile();
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
    isDataInvalid(data) {
      // ตรวจสอบว่าข้อมูลไม่ถูกต้องหรือไม่
      return (
        data.RequiredPurchaseOrderNo ||
        data.RequiredDate ||
        data.RequiredVendor ||
        data.RequiredTimeStart ||
        data.RequiredTimeEnd
      );
    },
    showErrorMessage(lineNumber) {
      // แสดงข้อความเตือนเมื่อพบข้อมูลที่ไม่ถูกต้อง
      return Swal.fire({
        text: `There is an error in the data, please check excel row ${lineNumber}.`,
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "Ok",
      });
    },
  },
};
</script>
<style>
.theme--light.v-table thead th {
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #007fc4 !important;
  font-size: 15px !important;
  color: #ffffff !important;
  /* background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff; */
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}
</style>
