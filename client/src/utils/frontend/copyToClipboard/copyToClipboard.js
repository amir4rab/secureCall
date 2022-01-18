export const copyToClipboard = (value) => {
  try {
    navigator.clipboard.writeText( value )
  } catch {
    console.error('Something went wrong, while copying text to clipboard!')
  }
};

export default copyToClipboard;