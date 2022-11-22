// profile: #198754
export default function RoundedRect({
  fill,
  width = 20,
  height = 20,
}: {
  fill: string
  width?: number
  height?: number
}) {
  return (
    <svg className="bd-placeholder-img rounded me-2" width={width} height={height} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false">
      <rect width="100%" height="100%" fill={fill} />
    </svg>
  );
}
