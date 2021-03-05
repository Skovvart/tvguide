import TvGuide from './TvGuide.svelte';
import dayjs from "dayjs";
import "dayjs/locale/da"
import relativeTime from "dayjs/plugin/relativeTime"
import duration from "dayjs/plugin/duration"

dayjs.locale("da")
dayjs.extend(relativeTime)
dayjs.extend(duration)

const tvGuide = new TvGuide({
	target: document.body
});

export default tvGuide;