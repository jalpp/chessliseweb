import React from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

interface LinkProp {
    name: string;
    url: string;
}

function LinkButton({ name, url }: LinkProp) {
    return (
        <Button component={Link} href={url} variant="contained" color="primary">
            {name}
        </Button>
    );
}

export default LinkButton;