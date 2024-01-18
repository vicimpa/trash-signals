import { computed, signal } from "@/library";

const num = signal(0);
const double = computed(() => num.value * 2);

num.subscribe(v => console.log(v));
double.subscribe(v => console.log(v));

num.value += 100;
num.value += 100;

setTimeout(() => {
  num.value += 100;
}, 100);