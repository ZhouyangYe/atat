import React from 'react';
import message from 'atat-common/lib/modules/message';

interface Props {
  children: React.ReactElement[] | React.ReactElement | string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: React.ErrorInfo) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // console.log(error, errorInfo);
    message.error('Something went wrong.');
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p style={{ color: 'crimson', fontWeight: 'normal' }}>Error</p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
