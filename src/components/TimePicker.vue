<template>
  <div class="time-picker">
    <select v-model="hours" @change="updateTime" class="time-dropdown">
      <option v-for="hour in 24" :key="hour" :value="hour - 1">{{ pad(hour - 1) }}</option>
    </select>
    :
    <select v-model="minutes" @change="updateTime" class="time-dropdown">
      <option v-for="minute in 60" :key="minute" :value="minute - 1">{{ pad(minute - 1) }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "TimePicker",
  props: {
    value: null,
    label: {
      type: String,
      default: '00:00',
    },
  },
  data() {
    return {
      hours: 0,
      minutes: 0,
    };
  },
  mounted() {
    // Set default to 00:00 if no value is provided
    if (this.value) {
      const [hours, minutes] = this.value.split(":");
      this.hours = parseInt(hours);
      this.minutes = parseInt(minutes);
    } else {
      this.hours = 0;
      this.minutes = 0;
    }
  },
  methods: {
    pad(number) {
      return number < 10 ? "0" + number : number;
    },
    updateTime() {
      this.$emit('input', `${this.pad(this.hours)}:${this.pad(this.minutes)}`);
    },
    clearTime() {
        this.hours = 0;
        this.minutes = 0;
        this.updateTime(); // Emit the updated time as "00:00"
      }
  },
};
</script>

<style scoped>
.time-picker {
  display: flex;
  align-items: center;
  gap: 5px;
}

.time-dropdown {
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.time-dropdown:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.time-picker select {
  width: 60px;
  text-align: center;
}

.time-picker::after {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  clip-path: polygon(100% 0, 0 0, 50% 100%);
  margin-left: 5px;
  pointer-events: none;
}
</style>
