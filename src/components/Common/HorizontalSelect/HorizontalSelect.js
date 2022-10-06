
//options: [{title, value},]
import {Button, Row, Spacer} from "@nextui-org/react";

export default function HorizontalSelect({options, selected, selectHandler, size}) {
    return (
        <Row css={{width: "min-content"}}>
            {options.map((item, idx) => (
                <Row css={{width: "min-content"}}>
                    <Button bordered={item.title !== selected.title} onPress={() => selectHandler(item)} auto size={size}>
                        {item.title}
                    </Button>
                    {idx !== options.length - 1 && <Spacer x={0.25}/>}
                </Row>
            ))}
        </Row>

    )
}