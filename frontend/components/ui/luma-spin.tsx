export const Component = () => {
  return (
    <div className="relative w-[65px] aspect-square">
      <span className="absolute rounded-[50px] animate-luma-spin shadow-[inset_0_0_0_3px] shadow-blue-500" />
      <span className="absolute rounded-[50px] animate-luma-spin-delay shadow-[inset_0_0_0_3px] shadow-blue-400" />
    </div>
  );
}; 